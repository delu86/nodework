//gets data for services detail pages
var mysql = require('mysql');
var mySqlConnection = mysql.createConnection({
  host     : '10.99.252.22',
  user     : 'epv',
  password : '',
  database : 'md'
});
//query
const query={
  FEAfirmati:"SELECT md_data as date,md_tot_err as errori,md_tot_canc as cancel,md_tot_regulas as regular,md_tot_revoked as revoked FROM md.wd_fea_volumi where md_abi=?;",
  CBI:"SELECT md_data as date,login,bonifici FROM md.wd_cbi_volumi where md_abi=?;",
  HB_Volumi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_volumi where md_abi=?;",
  HB_Tempi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_avg where md_abi=?;"
}
var _getJSONData=function(httpResponse,abi,serviceName){
  _executeQuery(httpResponse,query[serviceName],[abi]);
}
var _executeQuery=function(httpResponse,query,params){
  mySqlConnection.connect();
  mySqlConnection.query(query,params,function(err, results) {
    if(err) throw err;
     httpResponse.end(
       JSON.stringify(_getJSONObjectFromResults(results)));
  });
  mySqlConnection.end();
}
var _getJSONObjectFromResults=function(queryResults){
  var json={data:[]};
  for(var i=0;i<queryResults.length;i++){
    //console.log(queryResults[i]);
    json.data.push(queryResults[i]);
  }
  return json;
}
module.exports=
{
  getJSONData:_getJSONData
}
