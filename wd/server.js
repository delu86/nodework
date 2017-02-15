const express = require('express');
const session = require('express-session');
const assert = require('assert');
const bodyParser = require('body-parser');
const path = require('path');
const instituteInformationRetriever = require('./institute-information-retriever.js');
const loginManager = require('./login.js');
//Express app setup
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const INTERNAL_IP_ADDRESS_CONNECTION = '10.99.19.90';

app.use(express.static(path.join(__dirname,'views')));
app.set('views',__dirname+'/views');
app.set('view engine','pug');
app.use(session({secret:'sssshhh',
                 resave:true,
                saveUninitialized:true,
                cookie:{maxAge:1000*24*60*60}}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//start http server on port 80
http.listen(80,onHTTPserverStart);
function onHTTPserverStart(){
  console.log("Listening on port 80");
}



//Routing
app.get('/',getIndex);
function getIndex(request,response){
  request.session.user ? response.render('selectInstitute.pug') :
    (request.get("Host") == INTERNAL_IP_ADDRESS_CONNECTION ?
      response.render('selectInstitute.pug') :
      response.render('authenticationPage.pug')
    )
}

app.get('/logout',logout);
function logout(request,response) {
  request.session.user=null;
  response.redirect('/');
}


app.post('/login',login);
function login(request,response){
  loginManager.authenticate(request.body.email,request.body.password).then(onLoginOk(request,response))
                                                                     .catch(onLoginError(request,response));
}
function onLoginError(request,response){
  return function(message){
    response.redirect('/');
  }
}
function onLoginOk(request,response){
  return function(user){
    var session = request.session;
    session.user = user;
    response.redirect('/selectInstitute');
  }
}

app.get('/selectInstitute',selectInstitute)
function selectInstitute(request,response) {
  request.session.user ?
    response.render('selectInstitute.pug') :
    response.redirect('/');
}

app.get('/:institute_id',getEISWallDisplay);
function getEISWallDisplay(request,response) {
  request.session.user ?
    (isAuthorizedRequest(request) ? response.end("ok") :
                                  response.render("error.pug")) :
    response.redirect('/');
}
function isAuthorizedRequest(request) {
  //console.log(request.session.controlled_institutions);
  return request.session.user.institute_id==request.params.institute_id ||
             request.session.user.controlled_institutions.includes(request.params.institute_id);

}


// app.get('/testSession',testSession);
// function testSession(request,response){
//   response.end(`${request.session.user}
//                 : codice abi ${request.session.abi}`);
// }
