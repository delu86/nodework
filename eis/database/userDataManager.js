const query = require('./query.js');
const connections = require('./databaseConnections.js');
const emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function _findUser(email){
  var findUserPromise = _findUserPromise(email);
  return connections.getMongoConnectionPromise().then(findUserPromise);
}
//private
function _findUserPromise(email){
  return function(db){
    var promiseFunction = function(resolve,reject) {
      if(!email.match(emailPattern)) reject(new Error("formato email non valido"));
      db.collection("Institutions").aggregate(query.getFindUserQuery(email),
                                      function(err,data){
                                        db.close();
                                        err?reject(err):resolve(data[0]);
                                      });
    }
    return new Promise(promiseFunction);
  }
}
/*
Set user.actived flag to true
*/
function _activateUser(email){
  return function(){
    return connections.getMongoConnectionPromise().then(_activateUserPromise(email));
}}
//private
function _activateUserPromise(email){
  return function(db){
    var promiseFunction = function(resolve,reject) {
      db.collection("Institutions").updateOne({"users.email":email.toLowerCase()},{$set: {"users.$.activated":true}},function(err,data) {
        db.close();
        err?reject(err):resolve("utente attivato")
      });
    }
    return new Promise(promiseFunction);
  }
}

/*
find the institute id (abi), if exists, for that email
*/
function _findUserInstitute(email){
  var findUserInstitutePromise = _findUserInstitutePromise(email);
  return connections.getMongoConnectionPromise().then(findUserInstitutePromise);
}
//private
function _findUserInstitutePromise(email){
  return function(db){
    var promiseFunction = function(resolve,reject){
      if(!email.match(emailPattern)) reject(new Error("Email non valida"));
      db.collection("Institutions").findOne({mail_domain:email.split('@')[1].toLowerCase()},{abi:1},function(err,data) {
        db.close();
        err?reject(err):resolve(data)
      });
    }
   return new Promise(promiseFunction);
  }
}

function _addUser(instituteId,email,password,activationCode){
  var addUserPromise = _addUserPromise(instituteId,email,password,activationCode);
  return connections.getMongoConnectionPromise().then(addUserPromise);
}
//private
function _addUserPromise(instituteId,email,password,activationCode){
  return function(db){
    var promiseFunction = function(resolve,reject) {
      db.collection("Institutions").updateOne({abi:instituteId,mail_domain:email.split('@')[1].toLowerCase(), "users.email":{$ne: email}},
        {$push:{users:{email:email.toLowerCase(),password:password,activated:false,activationCode:activationCode}}}
        ,function(err,updateResult){
          db.close();
          err?reject(err):resolve(`${activationCode}`);
        });
    }
    return new Promise(promiseFunction);
  }
}

module.exports = {
  addUser : _addUser,
  findUser : _findUser,
  findUserInstitute : _findUserInstitute,
  activateUser : _activateUser
}
