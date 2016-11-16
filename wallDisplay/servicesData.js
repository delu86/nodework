//gets data for services detail pages
var mysql = require('mysql');
//query
const query={
  FEAfirmati:"SELECT md_data as date,md_tot_err as errori,md_tot_canc as cancellati,md_tot_regulas as regolari,md_tot_revoked as revocati FROM md.wd_fea_volumi where md_abi=?;",
  CBI:"SELECT md_data as date,login,bonifici,f24 FROM md.wd_cbi_volumi where md_abi=?;",
  HB_Volumi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_volumi where md_abi=?;",
  HB_Tempi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_avg where md_abi=?;",
  Ticket:"SELECT concat(substr(md_data_mmaaaa,1,4),'-',substr(md_data_mmaaaa,5,2)) as  periodo,md_tot_pervenuti as totale, md_avg_pervenuti_gg as media_giorno FROM md.md_ticket_mese where md_abi=? order by 1 limit 12"
}
var _getJSONData=function(httpResponse,abi,serviceName){
    _executeQuery(httpResponse,query[serviceName],[abi]);
}
var _executeQuery=function(httpResponse,query,params){
  var mySqlConnection = mysql.createConnection({
    host     : '10.99.252.22',
    user     : 'epv',
    password : '',
    database : 'md'
  });
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
