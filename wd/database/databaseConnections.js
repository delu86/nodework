const mongodb = require('mongodb').MongoClient;
const urlMongodb = "mongodb://10.99.19.90:27017/FAC";
const mySqlConnectionProperties = {
  host     : '10.99.19.90',
  user     : 'fac',
  password : 'facpass',
  database : 'md'
  }


function _getMongoConnectionPromise(){
  return new Promise(function(resolve, reject) {
    mongodb.connect(urlMongodb,function(err,db){
    err?reject(err.message):resolve(db);
    });
  });
  }


module.exports = {
  getMongoConnectionPromise : _getMongoConnectionPromise,
  mySqlConnectionProperties : mySqlConnectionProperties
  }
