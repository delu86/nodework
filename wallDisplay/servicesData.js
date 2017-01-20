//gets data for services detail pages
var mysql = require('mysql');
var MongoClient = require("mongodb").MongoClient;
var url_mongodb= require('./constant.js').urlMongodb;
var mySqlConnectionProperties= require('./constant.js').mySqlConnectionProperties;
//query
const query={
  FEAfirmati:"SELECT md_data as data,md_tot_err as errori,md_tot_canc as cancellati,md_tot_regulas as regolari,md_tot_revoked as revocati FROM md.wd_fea_volumi where md_abi=?  and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc limit 20;",
  CBI:"SELECT md_data as data,login,bonifici,f24 FROM md.wd_cbi_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Volumi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Tempi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_avg where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  Ticket:"SELECT concat(substr(md_data_mmaaaa,1,4),'-',substr(md_data_mmaaaa,5,2)) as  periodo,md_tot_pervenuti as totale, md_avg_pervenuti_gg as media_giorno FROM md.md_ticket_mese where md_abi=?  order by 1",
  PWS:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data,md_totTime as tempo_medio,md_tot_hits as hits FROM md.wd_pws_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by 1 asc;",
  OperazioniSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  CasseSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_SintesiStatoCliente:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_QuadroDiControllo:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;"
}
var _getJSONData=function(httpResponse,serviceName,abi,date){
  if (serviceName != "atm") {
      _executeQuery(httpResponse,query[serviceName],[abi,date]);
    }
    else {
      _getAtmData(httpResponse,serviceName,abi,date);
    }
}
var _getAtmData=function(httpResponse,serviceName,abi,date){
  MongoClient.connect(url_mongodb,function(err,db) {
    try{
      db.collection("WallDisplay").aggregate([{$match:{abi:abi,data:date}}
                         ,{$unwind:"$servizio"}
                         ,{$match: {"servizio.nomeservizio":"atm"}}
                         ,{$unwind:"$servizio.rilevazioni"}
                         ,{$project:{abi:1,data:{logtime:"$servizio.rilevazioni.logtime",disabled:"$servizio.rilevazioni.disabled"
                            ,non_eroga:"$servizio.rilevazioni.non_eroga",fuori_linea:"$servizio.rilevazioni.fuori_linea",
                            prob_hw:"$servizio.rilevazioni.probl_hw"}}}
                         ,{$group:{_id:"$abi",data:{$push:"$data"}}}
                         ]).each(function(err, doc) {
                            httpResponse.end(JSON.stringify(doc));
                            db.close();
                       });
    }
    catch(error){
      console.log("Error on db: "+error);
    }
  })
}
var _executeQuery=function(httpResponse,query,params){
  var mySqlConnection = mysql.createConnection(mySqlConnectionProperties);
  mySqlConnection.connect();
  mySqlConnection.query(query,params,function(err, results) {
     httpResponse.end(
       JSON.stringify(_getJSONObjectFromResults(results)));
  });
  mySqlConnection.end();
}
var _getJSONObjectFromResults=function(queryResults){
  try{
    var json={data:[]};
    for(var i=0;i<queryResults.length;i++){
    //console.log(queryResults[i]);
      json.data.push(queryResults[i]);
    }
    return json;
  }catch(e){
    console.log(e);
  }
}
module.exports=
{
  getJSONData:_getJSONData
}
