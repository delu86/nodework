const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const assert = require('assert');
const bodyParser = require('body-parser');
const registration = require('./registration.js');
const url = require('url');
const path = require('path');
const instituteInformationRetriever = require('./institute-information-retriever.js');
const loginManager = require('./login.js');
//Express app setup
const app = express();
const constant = require('./constant.js');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var metadata;
var store = new MongoDBStore(
  {
    uri: constant.MONGO_DB_SESSION_URL,
    collection: 'eisSessionProduction'
  });

app.use(express.static(path.join(__dirname,'views')));
app.set('views',__dirname+'/views');
app.set('view engine','pug');
app.use(session({secret:'ssssshhh',
                 name:'eisCookie',
                 store: store,
                 resave:true,
                 saveUninitialized:true,
                 cookie:{maxAge:1000*3600*24}}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(`${new Date()}: ${err}`);
})
//start http server on port 80
http.listen(80,onHTTPserverStart);
function onHTTPserverStart(){
  instituteInformationRetriever.getMetadata().then(onMetadataLoaded());
}
function onMetadataLoaded(){
  return function(meta){
    metadata=meta;
    console.log("Http server on port 80");
  }
}
 //socket io --> update of walldisplay
io.on('connection',onConnection);
function onConnection(socket){
  try{
    socket.on('json request', onJSONRequest(socket));
  }catch(error){
    console.log(error)
  }
}
function onJSONRequest(socket){
  return function(id){
    var cookieString=decodeURIComponent(socket.request.headers.cookie);
     [instituteId,date]=id.split("_");//abi_yyyy-mm-dd_id
     store.get(cookieString.split('eisCookie=s:')[1].split('.')[0]//get the session id
     ,function(error,session){
       if(error || !(session)) socket.emit('refresh');
       else{
       if(loginManager.isAuthorized(socket.request.headers,session.user,instituteId)){
         Promise.all([instituteInformationRetriever.getInstituteLastServicesRelevation(instituteId,date),
                     instituteInformationRetriever.getInstituteServicesTresholds(instituteId)]
                   ).then(emitJsonResponse(instituteId,socket)).catch(console.log)
       }else socket.emit('refresh');
     }
     });
   }
}



function emitJsonResponse(instituteId,socket) {
  return function(arrayResults){

     var json=`{"lastRel":${JSON.stringify(arrayResults[0])},
                   "tresholds":${JSON.stringify(arrayResults[1])},
                   "metadata":${JSON.stringify(metadata)}}`;
      socket.emit('json '+instituteId+' response', json);
  }
}


//Routing
app.get('/',getIndex);
function getIndex(request,response){
  if(request.session.user) {
    response.redirect('/selectInstitute');
    }else{
    (request.get("Host") == constant.INTERNAL_IP_ADDRESS_CONNECTION ?
      response.render('selectInstitute.pug') :
      response.render('authenticationPage.pug')
    )}
}

app.get('/registration',getRegistrationPage);
function getRegistrationPage(request,response){
  response.render('registrationPage.pug');
}

app.post('/submitRegistration',submitRegistration);
function submitRegistration(request,response){
  registration.signIn(request.body.email,request.body.password).then(onRegistrationComplete(response))
                                                               .catch(onRegistrationError(response));
}
function onRegistrationComplete(response){
  return function(){
    response.render('authenticationPage'
      ,{helpMessage: "Registrazione effettuata con successo; completa la procedura cliccando sul link inviato via email."})
  }
}
function onRegistrationError(response){
  return function(error){
    response.render('registrationPage'
      ,{errorMessage: error})
  }
}

app.get('/confirm',onAccountConfirm)
function onAccountConfirm(request,response){
  registration.activate(request.query.user,request.query.code).then(onAccountActivated(response))
                                                              .catch(onAccountRejected(response));
}
function onAccountActivated(response){
  return function(){
    response.render('authenticationPage.pug',{helpMessage:"Account attivato con successo"});
}}
function onAccountRejected(response){
  return function(err){
    response.render('authenticationPage.pug',{errorMessage:err.message});
}}


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
    response.render('authenticationPage.pug',{errorMessage:"Username o password errati"});
  }
}
function onLoginOk(request,response){
  return function(user){
    var session = request.session;
    session.user = user;
    console.log(`${new Date()}: ${user.email} ha effettuato l'accesso`);
    user.controlled_institutions.length==0 ?
      response.redirect(`/${user.abi}`) :
      response.redirect('/selectInstitute');
  }
}

app.get('/selectInstitute',selectInstitute)
function selectInstitute(request,response) {
  if(request.session.user){
    request.session.user.controlled_institutions==='all'?
      response.render('selectInstitute.pug') :
      response.render('chooseControlledInstitute.pug',{abi:request.session.user.abi,controlledInstitutions:request.session.user.controlled_institutions}) ;
  }else response.redirect('/');
}


app.get('/:institute_id',getEISWallDisplay);
function getEISWallDisplay(request,response) {
  var connection_id = Math.floor(Math.random() * 10000);
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id) ?
                      response.render("wallDisplay.pug",{connection_id:connection_id,abi_code:request.params.institute_id,date:request.query.date}) :
                      (request.session.user==null || typeof(request.session.user)=="undefined" ?
                      response.redirect('/') :
                      response.render("error.pug"));
}

app.get('/getJSON/:institute_id',createEISWalldisplayJSON);
function createEISWalldisplayJSON(request,response) {
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id) ?
  Promise.all([instituteInformationRetriever.getInstituteLastServicesRelevation(request.params.institute_id,request.query.date),
               instituteInformationRetriever.getInstituteServicesTresholds(request.params.institute_id)]
             ).then(onCreateEISWalldisplayJSONPromisesExecuted(response)).catch(console.log)
               : response.end(`{"message" : "richiesta non autorizzata"}`);
}
function onCreateEISWalldisplayJSONPromisesExecuted(response) {
  return function(results){
      response.end(`{"lastRel":${JSON.stringify(results[0])},
                    "tresholds":${JSON.stringify(results[1])},
                    "metadata":${JSON.stringify(metadata)}}`);
  }
}

app.get('/getJSON/:institute_id/:service_name',getWallDisplayServiceChart);
function getWallDisplayServiceChart(request,response) {
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id)?
    instituteInformationRetriever.getServiceInformationOnDate(request.params.institute_id,request.query.date,request.params.service_name)
    .then(onWallDisplayServiceChartDataRetrieved(response)).catch(console.log)
    : response.end(`{"message" : "richiesta non autorizzata"}`);
}
function onWallDisplayServiceChartDataRetrieved(response) {
  return function(data){
    response.end(JSON.stringify(data));
  }
}
app.get('/servicePage/:institute_id',getServiceDetailPage);
function getServiceDetailPage(request,response){
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id) ?
                                                                response.render("service.pug",{service:request.query.service,
                                                                abi:request.params.institute_id,date:request.query.date}) :
                      (request.session.user==null || typeof(request.session.user)=="undefined" ?
                      response.redirect('/') :
                      response.render("error.pug"));
}
app.get('/serviceDetailJSON/:institute_id',getServiceDetailJSON);
function getServiceDetailJSON(request,response) {
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id)?
                                instituteInformationRetriever.getInstituteServiceData(request.query.service,request.params.institute_id,request.query.date)
                                .then(onServiceDetailRetrieved(response)).catch(console.log) :
                                response.end(`{"message" : "richiesta non autorizzata"}`);
}
function onServiceDetailRetrieved(response){
  return function(objectData){
    response.end(JSON.stringify(objectData));
  }
}

app.get('/getInfo/:institute_id/:service_name/:date',getServiceDailyDetail);
function getServiceDailyDetail(request,response) {
  response.render("dailyInfo.pug",{abi_code:request.params.institute_id,service:request.params.service_name,date:request.params.date})
}
app.get('/getInfoJSON/:institute_id/:service_name/:date',getServiceDailyDetailJSON);
function getServiceDailyDetailJSON(request,response) {
  loginManager.isAuthorized(request.get("Host"),request.session.user,request.params.institute_id)?
  instituteInformationRetriever.getServiceDailyDetail(request.params.institute_id,request.params.service_name,request.params.date)
  .then(onServiceDailyDetailRetrieved(response)).catch(console.log)
  : response.end(`{"message" : "richiesta non autorizzata"}`);
}
function onServiceDailyDetailRetrieved(response){
  return function(data){
    response.end(JSON.stringify(data));
  }
}
