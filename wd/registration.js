const database = require('./database.js');
const crypto = require('./crypto.js');
const SecretCodeGenerator = require('./codeGenerator');
const mailer= require('./mail.js');

function signIn(email,password) {
  return _verifyCondition(email,password)
          .then(_createNewUser(email,password))
          .then(_sendAccountConfirmationMail(email));
}
function _sendAccountConfirmationMail(email){
  return function(activationCode){
  var mailOptions = {
      from: 'noreply@cedacri.it', // sender address
      to: `${email}` , // list of receivers
      subject: 'Registrazione a portale EIS', // Subject line
      text: `Conferma la registrazione cliccando sul link seguente
             http://walldisplay.cedacri.it/confirm?user=${email}&code=${activationCode}
            `, // plaintext body
  };
  return mailer.sendMail(mailOptions);}
}
function _verifyCondition(email,password){
  return Promise.all([_isPasswordOk(password),_userAlreadyExist(email),_isDomainSurveyed(email)]);
}
function _isPasswordOk(password){
  return new Promise(function(resolve, reject) {
    password.length >= 6 ? resolve(true) : reject("Password troppo breve")
  });
}
function _userAlreadyExist(email){
 return database.findUser(email).then(_userAlreadyExistPromise());
}
function _userAlreadyExistPromise() {
  return function(users){
    return new Promise(function(resolve,reject){
      users == null ? resolve(false) : reject(new Error("Utente già registrato"));
    })
  }
}
function _isDomainSurveyed(email){
  return database.findUserInstitute(email).then(_isDomainSurveyedPromise());
}
function _isDomainSurveyedPromise(){
  return function(data){
    return new Promise(function(resolve,reject){
      data == null ? reject(new Error("Email non censita")) : resolve(data);
    })
  }
}

function _createNewUser(email,password){
  return function(arrayData){//arrayData[2].abi contains institute ID
    var cryptedPassword = crypto.encrypt(password);
    var activationCode = new SecretCodeGenerator().generate();
    return database.addUser(arrayData[2].abi,email,cryptedPassword,activationCode);
  }
}

function activate(email,activationCode){
  return database.findUser(email).then(_verifyActivationCondition(activationCode)).then(database.activateUser(email));
}
function _verifyActivationCondition(activationCode){
  return function(user){
    return new Promise(function(resolve,reject){
      user == null ? reject(new Error("Utente non registrato")) :
        (user.activated == true ? reject(new Error("Utente già attivato")) :
          (user.activationCode === activationCode ?  resolve(user.email) : reject(new Error(`Codice di attivazione errato ${user.email}`))))
    })
  }
}

module.exports={
  activate:activate,
  signIn:signIn
}
//_isDomainSurveyed("pippo@crvolterrad.it").then(console.log).catch(console.log);
activate("simone.deluca@consulenti.cedacri.it","dVWVyJFINbTzFL7vbKeU").then(console.log).catch(console.log);
//activate("SIMONE@CRVOLTERRA.it","sjXfyCh6e6LSQ9Z4DIua").then(console.log).catch(console.log);
//activate("aldo@CRVOLTERRA.it","4tcKd5bOp6w7Y4Pc04oi").then(console.log).catch(console.log);
