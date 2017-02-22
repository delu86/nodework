const _serviceHistoryQuery = {
  FEAfirmati:"SELECT md_data as data,md_tot_err as errori,md_tot_canc as cancellati,md_tot_regulas as regolari,md_tot_revoked as revocati FROM md.wd_fea_volumi where md_abi=?  and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc limit 20;",
  CBI:"SELECT md_data as data,login,bonifici,f24 FROM md.wd_cbi_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Volumi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Tempi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_avg where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  Ticket:"SELECT concat(substr(md_data_mmaaaa,1,4),'-',substr(md_data_mmaaaa,5,2)) as  periodo,md_tot_pervenuti as totale, md_avg_pervenuti_gg as media_giorno FROM md.md_ticket_mese where md_abi=?  order by 1",
  PWS:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data,md_totTime as tempo_medio,md_tot_hits as hits FROM md.wd_pws_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by 1 asc;",
  OperazioniSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  CasseSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_SintesiStatoCliente:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_QuadroDiControllo:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  atm:"SELECT substr(time_ult_msg,1,19) as logtime,disabled,noneroga as non_eroga,fuori_linea,probl_hw as problemi_hw FROM md_atm where abi=? and date(time_ult_msg)=? order by 1;"
}
const _queryTreshold =  `SELECT md_servizio,if(md_servizio='TICKET',round(md_soglia),md_soglia) as
                      md_soglia from md.wd_soglie where md_abi=? and md_servizio in
                      ('TICKET','PWS','HB','CBI','FEU') order by md_data desc,md_abi; `;

function  _getWalldisplayChartsQuery(serviceName, instituteId , date){
  var matchAbiDate={$match: {"abi":instituteId,"data":date}};
  var matchAbiDateLte={$match: {"abi":instituteId,"data":{$lte:date}}};
  var unwindService={$unwind:"$servizio"};
  var matchServiceName={$match:{"servizio.nomeservizio":serviceName}};
  var limit1={$limit:1};
  var limit6={$limit:6};
  var query = {
      "FEU_SintesiStatoCliente":[matchAbiDate,limit1,unwindService,matchServiceName,{$unwind:"$servizio.rilevazioni"}
              ,{$group: {_id:{abi:"$abi",logtime:"$servizio.rilevazioni.logtime"},TempoMedio: { $max: "$servizio.rilevazioni.TempoMedio" }}}
              ,{$sort: {"_id.logtime":1}}
              ,{$group: {_id:"$_id.abi",categories:{$push:"$_id.logtime"},data:{$push:"$TempoMedio"}}}],
      "FEU_QuadroDiControllo": [matchAbiDate,limit1,unwindService,matchServiceName,{$unwind:"$servizio.rilevazioni"}
                ,{$group: {_id:{abi:"$abi",logtime:"$servizio.rilevazioni.logtime"},TempoMedio: { $max: "$servizio.rilevazioni.TempoMedio" }}}
                ,{$sort: {"_id.logtime":1}}
                ,{$group: {_id:"$_id.abi",categories:{$push:"$_id.logtime"},data:{$push:"$TempoMedio"}}}]    ,
      "atm":  [matchAbiDate,limit1,unwindService,matchServiceName
                  ,{$project:{rel:{$slice: ["$servizio.rilevazioni",-1]}}}
                  ,{$unwind:"$rel"}
                  ,{$project:{data:["$rel.disabled","$rel.non_eroga","$rel.fuori_linea","$rel.probl_hw"],
                  categories:["disabled","non_eroga","fuori_linea","probl_hw"]}}],
      "PWS": [matchAbiDate,limit1,unwindService,matchServiceName
                                ,{$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.TempoMedio"}}],
      "HB":  [matchAbiDate,limit1,unwindService,matchServiceName
                                  ,{$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.Durata"}}] ,
      "CBI": [matchAbiDateLte,limit6,unwindService,matchServiceName,
                                    {$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
                                    ,{$unwind:"$rel"}
                                    ,{$sort: {data:1}}
                                    ,{$group: {_id:"$abi",data:{$push: "$rel.TotaleLogon"},categories:{$push: "$data"}}}
                                  ] ,
      "Ticket":  [matchAbiDateLte,limit6,unwindService,matchServiceName
                                    ,{$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
                                    ,{$unwind:"$rel"}
                                    ,{$sort: {data:1}}
                                    ,{$group: {_id:"$abi",data:{$push: "$rel.Pervenuti"},categories:{$push: "$data"}}}] ,
      "OperazioniSportello":  [matchAbiDateLte,limit6,unwindService,matchServiceName
                                      ,{$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
                                      ,{$unwind:"$rel"}
                                      ,{$sort: {data:1}}
                                      ,{$group: {_id:"$abi",data:{$push: "$rel.Operations"},categories:{$push: "$data"}}}] ,
      "CasseSportello": [matchAbiDate,limit1,unwindService,matchServiceName
                                        ,{$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.OpenCashesToday"}}] ,
      "FEAfirmati": [matchAbiDateLte,limit6,unwindService,matchServiceName
                                          ,{$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
                                          ,{$unwind:"$rel"}
                                          ,{$sort: {data:1}}
                                          ,{$group: {_id:"$abi",data:{$push: "$rel.firmati"},categories:{$push: "$data"}}}]
                                        }
    return query[serviceName];
}
function _getFindUserQuery(email){
  return [{$match: {mail_domain:email.split('@')[1].toLowerCase()}}
  ,{$unwind:"$users"}
  ,{$match:{"users.email":email.toLowerCase()}}
  ,{$project: {users:1,abi:1,controlled_institutions:1}}
  ,{$project:{email:"$users.email",password:"$users.password",
              activationCode:"$users.activationCode",abi:1,controlled_institutions:1,
              activated:"$users.activated"}}]
            }

module.exports = {
  getWalldisplayChartsQuery: _getWalldisplayChartsQuery,
  serviceHistoryQuery : _serviceHistoryQuery,
  queryTreshold : _queryTreshold,
  getFindUserQuery : _getFindUserQuery
}
