"use strict";
var  url=require('./constant.js').urlMongodb;
//gets data for WallDisplay charts
var   _getData=function(abi,date,serviceName,mongoClient,res){
    mongoClient.connect(url,function(err,db){
      var results;
      //  assert.equal(null,errorConnection);
      switch (serviceName) {
          case "FEU_SintesiStatoCliente":
           return _getFEUStatoCliente(db,abi,date,serviceName,res);
            break;
          case "FEU_QuadroDiControllo":
            return _getFEUQuadroControllo(db,abi,date,serviceName,res);
             break;
          case "PWS":
             return _getPWS(db,abi,date,serviceName,res);
            break;
          case "HB":
            return _getHB(db,abi,date,serviceName,res);
            break;
          case "atm":
            return _getATM(db,abi,date,serviceName,res);
            break;
          case "CBI":
            return _getCBI(db,abi,date,serviceName,res);
            break;
          case "Ticket":
            return _getTicket(db,abi,date,serviceName,res);
            break;
          case "OperazioniSportello":
            return _getOperazioniSportello(db,abi,date,serviceName,res);
            break;
          case "CasseSportello":
            return _getCasse(db,abi,date,serviceName,res);
            break;
          case "FEAfirmati":
            return _getFEA(db,abi,date,serviceName,res);
            break;
          default:
            return _getPWS(db,abi,date,serviceName,res);
            break;
        }
    });
  };
  var _getFEUStatoCliente=function(db,abi,date,serviceName,res){
    // Create a collection
    try{
    var collection=db.collection('WallDisplay');
    collection.aggregate([
        {$match: {"abi":abi,"data":date}}
        ,{$limit: 1}
        ,{$unwind:"$servizio"}
        ,{$match:{"servizio.nomeservizio":"FEU_SintesiStatoCliente"}}
        ,{$unwind:"$servizio.rilevazioni"}
        ,{$group: {_id:{abi:"$abi",logtime:"$servizio.rilevazioni.logtime"},TempoMedio: { $max: "$servizio.rilevazioni.TempoMedio" }}}
        ,{$sort: {"_id.logtime":1}}
        ,{$group: {_id:"$_id.abi",categories:{$push:"$_id.logtime"},data:{$push:"$TempoMedio"}}}
    ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });}
  catch(e){
    console.log("Error on db: "+e);
  }
  };
  var _getFEUQuadroControllo=function(db,abi,date,serviceName,res){
    try{
    // Create a collection
    var collection=db.collection('WallDisplay');
    collection.aggregate([
      {$match: {"abi":abi,"data":date}}
      ,{$limit: 1}
      ,{$unwind:"$servizio"}
      ,{$match:{"servizio.nomeservizio":"FEU_QuadroDiControllo"}}
      ,{$unwind:"$servizio.rilevazioni"}
      ,{$group: {_id:{abi:"$abi",logtime:"$servizio.rilevazioni.logtime"},TempoMedio: { $max: "$servizio.rilevazioni.TempoMedio" }}}
      ,{$sort: {"_id.logtime":1}}
      ,{$group: {_id:"$_id.abi",categories:{$push:"$_id.logtime"},data:{$push:"$TempoMedio"}}}
    ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });}
  catch(e){
    console.log("Error on db: "+e);
  }
  };
  var _getFEA=function(db,abi,date,serviceName,res){
    try{
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi, "data":{$lte:date}}},
         {$limit: 6}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"FEAfirmati"}}
    ,    {$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$sort: {data:1}}
    ,    {$group: {_id:"$abi",data:{$push: "$rel.firmati"},categories:{$push: "$data"}}}
       ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
  }
  catch(e){
    console.log("Error on db: "+e);
  }
  }
  var _getCBI=function(db,abi,date,serviceName,res){
    try{
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi,"data":{$lte:date}}},
         {$limit: 6}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"CBI"}}
    ,    {$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$sort: {data:1}}
    ,    {$group: {_id:"$abi",data:{$push: "$rel.TotaleLogon"},categories:{$push: "$data"}}}
       ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
}
catch(e){
  console.log("Error on db: "+e);
}
  }
  var _getTicket=function(db,abi,date,serviceName,res){
    try{
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi, data:{$lte:date}}},
         {$limit: 6}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"Ticket"}}
    ,    {$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$sort: {data:1}}
    ,    {$group: {_id:"$abi",data:{$push: "$rel.Pervenuti"},categories:{$push: "$data"}}}
       ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
  }
  catch(e){
    console.log("Error on db: "+e);
  }
  }
  var _getOperazioniSportello=function(db,abi,date,serviceName,res){
    try{
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi, "data":{$lte:date}}},
         {$limit: 6}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"OperazioniSportello"}}
    ,    {$project:{abi:1,data:1,rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$sort: {data:1}}
    ,    {$group: {_id:"$abi",data:{$push: "$rel.Operations"},categories:{$push: "$data"}}}
       ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
}
catch(e){
  console.log("Error on db: "+e);
}
  }
  var _getATM=function(db,abi,date,serviceName,res){
    try{
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi,"data":date}},
         {$limit: 1}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"atm"}}
    ,    {$project:{rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$project:{data:["$rel.disabled","$rel.non_eroga","$rel.fuori_linea","$rel.probl_hw"],
                    categories:["disabled","non_eroga","fuori_linea","probl_hw"]}}
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
   }
   catch(e){
     console.log("Error on db: "+e);
   }
  };
  var _getPWS=function(db,abi,date,serviceName,res){
    try{
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi,"data":date}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"PWS"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.TempoMedio"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
   }
   catch(e){
     console.log("Error on db: "+e);
   }
  };
  var _getCasse=function(db,abi,date,serviceName,res){
    try{
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi,"data":date}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"CasseSportello"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.OpenCashesToday"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
   }
   catch(e){
     console.log("Error on db: "+e);
   }
  };
  var _getHB=function(db,abi,date,serviceName,res){
      try{
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi,"data":date}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"HB"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.Durata"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
   }
   catch(e){
     console.log("Error on db: "+e);
   }
  };
module.exports=
{
  getData:_getData,
  getCasse:_getCasse,
  getPWs:_getPWS,
  getHB:_getHB,
  getFEA:_getFEA,
  getATM:_getATM,
  getTicket:_getTicket,
  getOperazioniSportello:_getOperazioniSportello,
  getCBI:_getCBI,
  getFEUQuadroControllo:_getFEUQuadroControllo,
  getFEUStatoCliente:   _getFEUStatoCliente
  }
