const mongodb = require('mongodb').MongoClient;
const constant = require('../constant.js');

function _getMongoConnectionPromise(){
  return new Promise(function(resolve, reject) {
    mongodb.connect(constant.MONGO_DB_URL,function(err,db){
    err?reject(err.message):resolve(db);
    });
  });
  }


module.exports = {
  getMongoConnectionPromise : _getMongoConnectionPromise,
  mySqlConnectionProperties : constant.MYSQL_CONNECTION_PROPERTIES
  }
