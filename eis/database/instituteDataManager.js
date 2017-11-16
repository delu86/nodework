const query = require('./query.js');
const connections = require('./databaseConnections.js');
const mysql = require('mysql');
/*
Function for retrieving data for charts & tables
*/
function  _getServiceInformationOnDate(instituteId,date,serviceName){
    return connections.getMongoConnectionPromise().then(_getServiceInformationOnDatePromise(instituteId,date,serviceName));
  }


function  _getServiceDailyDetail(instituteId,date,serviceName){
    return connections.getMongoConnectionPromise()
    .then(_getServiceDailyDetailPromise(instituteId,date,serviceName));
  }
function _getServiceDailyDetailPromise(serviceName,instituteId,date){
  return function(db) {
    var promiseFunction=function(resolve,reject)  {
      db.collection('WallDisplay').aggregate(
        query.getServiceDailyDetail(serviceName,instituteId,date))
      .each(function(err, doc) {
          db.close();
          err?reject(err) : resolve(doc)
          });
    }
    return new Promise(promiseFunction);
  }
}
function _getServiceInformationOnDatePromise(instituteId,date,serviceName){
    return function(db) {
      var promiseFunction=function(resolve,reject)  {
        db.collection('WallDisplay').aggregate(query.getWalldisplayChartsQuery(serviceName,instituteId,date))
          .each(function(err, doc) {
              db.close();
              err?reject(err) : resolve(doc)
              });}
      return new Promise(promiseFunction);
  }
  }

function _getInstituteLastRelevationOnDate(instituteId,relevationDate){
    var getInstituteLastRelevationOnDatePromise = _getInstituteLastRelevationOnDatePromise(instituteId,relevationDate);
    return connections.getMongoConnectionPromise().then(getInstituteLastRelevationOnDatePromise);
  }
function _getInstituteLastRelevationOnDatePromise(instituteId,relevationDate){
      return function(db){
        var promiseFunction = function(resolve,reject){
          db.collection("WallDisplay").findOne({"abi":instituteId,"data":relevationDate},{"servizio.rilevazioni":{$slice:-1}},function(err,data){
            db.close();
            err?reject(err.message):resolve(data);
          });}
      return new Promise(promiseFunction)}
  }

function _getServiceData(serviceName,instituteId,date){
    var mySqlConnection =mysql.createConnection(connections.mySqlConnectionProperties);
    mySqlConnection.connect();
    var promiseFunction =function(resolve,reject){
      mySqlConnection.query(query.serviceHistoryQuery[serviceName],[instituteId,date],function(err, results) {
         err ? reject(err) : resolve(_getJSONObjectFromResults(results));
      });
      mySqlConnection.end();
    }
    return new Promise(promiseFunction);
  }
function _getJSONObjectFromResults(queryResults){
    var json={data:[]};
    for(var i=0;i<queryResults.length;i++){
    //console.log(queryResults[i]);
      json.data.push(queryResults[i]);
    }
    return json;
  }

function _getMetadata(){
    return connections.getMongoConnectionPromise().then(_getMetadataPromise());
  }
function _getMetadataPromise(){
    return function(db){
      var promiseFunction=function(resolve,reject){
        db.collection("WallDisplayMetadata").findOne({},
          function(err,data){
            err? reject(err) : resolve(data);})
      }
    return new Promise(promiseFunction);
    }
  }


function _getServicesTresholds(instituteId){
    var connection = mysql.createConnection(connections.mySqlConnectionProperties);
    var resolveFunction = _createTresholdObjectFromQueryResults;
    var promiseFunction = function(resolve, reject) {
        connection.query(query.queryTreshold,instituteId,function(err,queryResults){
          err?reject(err.message):resolve(resolveFunction(queryResults));
          });
        connection.end();
    };
    return new Promise(promiseFunction);
  }


function _createTresholdObjectFromQueryResults(queryResults){
    return queryResults.reduce(
      (accumulator,currentValue)=>{
        accumulator[currentValue.md_servizio]=currentValue.md_soglia;
        return accumulator;
      }
      ,{});
  }
  module.exports = {
    getServiceInformationOnDate : _getServiceInformationOnDate,
    getInstituteLastRelevationOnDate : _getInstituteLastRelevationOnDate,
    getServiceData : _getServiceData,
    getMetadata : _getMetadata,
    getServicesTresholds : _getServicesTresholds,
    getServiceDailyDetail : _getServiceDailyDetail
  };
