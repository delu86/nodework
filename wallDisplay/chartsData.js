"use strict";
var  url="mongodb://10.99.252.22:27017/FAC";

var   _getData=function(abi,serviceName,mongoClient,res){
    mongoClient.connect(url,function(err,db){
      var results;
      //  assert.equal(null,errorConnection);
      switch (serviceName) {
          case "FEU_SintesiStatoCliente":
           return _getFEUStatoCliente(db,abi,serviceName,res);
            break;
          case "FEU_QuadroDiControllo":
            return _getFEUQuadroControllo(db,abi,serviceName,res);
             break;
          case "PWS":
             return _getPWS(db,abi,serviceName,res);
            break;
          case "HB":
            return _getHB(db,abi,serviceName,res);
            break;
          case "atm":
            return _getATM(db,abi,serviceName,res);
            break;
          case "CBI":
            return _getCBI(db,abi,serviceName,res);
            break;
          case "Ticket":
            return _getTicket(db,abi,serviceName,res);
            break;
          case "OperazioniSportello":
            return _getOperazioniSportello(db,abi,serviceName,res);
            break;
          case "CasseSportello":
            return _getCasse(db,abi,serviceName,res);
            break;
          case "FEAfirmati":
            return _getFEA(db,abi,serviceName,res);
            break;
          default:
            return _getPWS(db,abi,serviceName,res);
            break;
        }
    });
  };
  var _getFEUStatoCliente=function(db,abi,serviceName,res){
    // Create a collection
    var collection=db.collection('WallDisplay');
    collection.aggregate([
      {$match: {"abi":abi}},
      {$limit: 1},
      {$unwind:"$servizio"},
      {$match: {"servizio.nomeservizio":"FEU_SintesiStatoCliente"}},
      {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.TempoMedio"}},
    ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
  };
  var _getFEUQuadroControllo=function(db,abi,serviceName,res){
    // Create a collection
    var collection=db.collection('WallDisplay');
    collection.aggregate([
      {$match: {"abi":abi}},
      {$limit: 1},
      {$unwind:"$servizio"},
      {$match: {"servizio.nomeservizio":"FEU_QuadroDiControllo"}},
      {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.TempoMedio"}},
    ]).each(function(err, doc) {
      res.end(JSON.stringify(doc));
      db.close();
  });
  };
  var _getFEA=function(db,abi,serviceName,res){
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi}},
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
  var _getCBI=function(db,abi,serviceName,res){
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi}},
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
  var _getTicket=function(db,abi,serviceName,res){
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi}},
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
  var _getOperazioniSportello=function(db,abi,serviceName,res){
    var collection=db.collection('WallDisplay');
    collection.aggregate([
         {$match: {"abi":abi}},
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
  var _getATM=function(db,abi,serviceName,res){
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi}},
         {$limit: 1}
    ,    {$unwind:"$servizio"}
    ,    {$match: {"servizio.nomeservizio":"atm"}}
    ,    {$project:{rel:{$slice: ["$servizio.rilevazioni",-1]}}}
    ,    {$unwind:"$rel"}
    ,    {$project:{data:["$rel.disabled","$rel.non_eroga","$rel.fine_soldi","$rel.fuori_linea","$rel.probl_hw"],
                    categories:["disabled","non_eroga","fine_soldi","fuori_linea","probl_hw"]}}
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
  };
  var _getPWS=function(db,abi,serviceName,res){
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"PWS"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.TempoMedio"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
  };
  var _getCasse=function(db,abi,serviceName,res){
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"CasseSportello"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.OpenCashesToday"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
  };
  var _getHB=function(db,abi,serviceName,res){
       // Create a collection
       var collection=db.collection('WallDisplay');
       collection.aggregate([
         {$match: {"abi":abi}},
         {$limit: 1},
         {$unwind:"$servizio"},
         {$match: {"servizio.nomeservizio":"HB"}},
         {$project :   { "categories":"$servizio.rilevazioni.logtime"  , "data":"$servizio.rilevazioni.Durata"}},
       ]).each(function(err, doc) {
         res.end(JSON.stringify(doc));
         db.close();
     });
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