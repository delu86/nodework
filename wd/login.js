const userDataManager = require('./database/userDataManager.js');
const crypto = require('./crypto.js');

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

module.exports = {
  authenticate:authenticate
};
