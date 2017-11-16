const userDataManager = require('./database/userDataManager.js');
const crypto = require('./crypto.js');
const INTERNAL_IP_ADDRESS_CONNECTION = require('./constant.js').INTERNAL_IP_ADDRESS_CONNECTION;

function authenticate(email,password) {
  return userDataManager.findUser(email)
                 .then(_verifyAuthenticationPromise(password));

}
function _verifyAuthenticationPromise(password) {
  return function(user){
    return new Promise(function(resolve, reject) {
       var outcome = _existUser(user) && _isActivated(user) && _isPasswordCorrect(user,password);
       outcome ? resolve(user) : reject(new Error("Credenziali errate"));
    });
  }
}

function _existUser(user) {
  return user != null
}

function _isActivated(user) {
  return user.activated;
}

function _isPasswordCorrect(user,password) {
  return user.password === crypto.encrypt(password);
}

function isAuthorized(host,user,instituteId){
  if(host===INTERNAL_IP_ADDRESS_CONNECTION){
    return true
  }else{
    if(user)
        return user.controlled_institutions==="all"||user.abi==instituteId ||
               user.controlled_institutions.includes(instituteId)
    else return false;
  }
}

module.exports = {
  INTERNAL_IP_ADDRESS_CONNECTION:INTERNAL_IP_ADDRESS_CONNECTION,
  authenticate:authenticate,
  isAuthorized:isAuthorized
};
