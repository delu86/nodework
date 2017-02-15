const urlMongodb = "mongodb://10.99.19.90:27017/TEST";
const mySqlConnectionProperties = {
  host     : '10.99.19.90',
  user     : 'fac',
  password : 'facpass',
  database : 'md'
};
const queryTreshold =  `SELECT md_servizio,if(md_servizio='TICKET',round(md_soglia),md_soglia) as
                      md_soglia from md.wd_soglie where md_abi=? and md_servizio in
                      ('TICKET','PWS','HB','CBI','FEU') order by md_data desc,md_abi; `;
const query = {
  FEAfirmati:"SELECT md_data as data,md_tot_err as errori,md_tot_canc as cancellati,md_tot_regulas as regolari,md_tot_revoked as revocati FROM md.wd_fea_volumi where md_abi=?  and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc limit 20;",
  CBI:"SELECT md_data as data,login,bonifici,f24 FROM md.wd_cbi_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Volumi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_volumi where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  HB_Tempi:"SELECT md_data as data,login,bonifici,f24,estrattoconto FROM wd_hb_avg where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31 order by 1 asc;",
  Ticket:"SELECT concat(substr(md_data_mmaaaa,1,4),'-',substr(md_data_mmaaaa,5,2)) as  periodo,md_tot_pervenuti as totale, md_avg_pervenuti_gg as media_giorno FROM md.md_ticket_mese where md_abi=?  order by 1",
  PWS:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data,md_totTime as tempo_medio,md_tot_hits as hits FROM md.wd_pws_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by 1 asc;",
  OperazioniSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  CasseSportello:"SELECT  concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, `md_ns`.`md_hits` as hits, `md_ns`.`mtime`/1000 as tempo_medio FROM `md`.`md_ns` where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_SintesiStatoCliente:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;",
  FEU_QuadroDiControllo:"SELECT concat(substr(md_data,1,4),'-',substr(md_data,5,2),'-',substr(md_data,7,2)) as data, md_hits as hits, md_avgTime as tempo_medio FROM md.md_feu_abi_day where md_abi=? and DATEDIFF(?,md_data) BETWEEN 0 and 31  order by md_data;"
}
class DatabaseClient {
  constructor() {
    this.mysql = require('mysql');
    this.mongodb = require('mongodb').MongoClient;
    this.mySqlConnection = this.mysql.createConnection(mySqlConnectionProperties);
  }


  findUser(email){
    var findUserPromise = this._findUserPromise(email);
    return this._getMongoConnectionPromise().then(findUserPromise);
  }
  _findUserPromise(email){
    return function(db){
      var promiseFunction = function(resolve,reject) {
        db.collection("Institutions").aggregate([{$match: {mail_domain:email.split('@')[1].toLowerCase()}}
                                                 ,{$unwind:"$users"}
                                                 ,{$match:{"users.email":email.toLowerCase()}}
                                                 ,{$project: {users:1,abi:1,controlled_institutions:1}}
                                                 ,{$project:{email:"$users.email",password:"$users.password",
                                                            activationCode:"$users.activationCode",abi:1,controlled_institutions:1,
                                                            activated:"$users.activated"}}],
                                        function(err,data){
                                          db.close();
                                          err?reject(err):resolve(data[0]);
                                        });
      }
      return new Promise(promiseFunction);
    }
  }


  activateUser(email){
    var that=this;
    return function(){
      return that._getMongoConnectionPromise().then(that._activateUserPromise(email));
  }}
  _activateUserPromise(email){
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


  findUserInstitute(email){
    var findUserInstitutePromise = this._findUserInstitutePromise(email);
    return this._getMongoConnectionPromise().then(findUserInstitutePromise);
  }
  _findUserInstitutePromise(email){
    return function(db){
      var promiseFunction = function(resolve,reject){
        db.collection("Institutions").findOne({mail_domain:email.split('@')[1].toLowerCase()},{abi:1},function(err,data) {
          db.close();
          err?reject(err):resolve(data)
        });
      }
     return new Promise(promiseFunction);
    }
  }


  addUser(instituteId,email,password,activationCode){
    var addUserPromise = this._addUserPromise(instituteId,email,password,activationCode);
    return this._getMongoConnectionPromise().then(addUserPromise);
  }
  _addUserPromise(instituteId,email,password,activationCode){
    return function(db){
      var promiseFunction = function(resolve,reject) {
        db.collection("Institutions").updateOne({abi:instituteId, "users.email":{$ne: email}},
          {$push:{users:{email:email.toLowerCase(),password:password,activated:false,activationCode:activationCode}}}
          ,function(err,updateResult){
            db.close();
            err?reject(err):resolve(`${activationCode}`);
          });
      }
      return new Promise(promiseFunction);
    }
  }

  getInstituteRelevationOnDate(instituteId,relevationDate){
    var getInstituteRelevationOnDatePromise = this._getInstituteRelevationOnDatePromise(instituteId,relevationDate);
    return this._getMongoConnectionPromise().then(getInstituteRelevationOnDatePromise);
  }
  _getInstituteRelevationOnDatePromise(instituteId,relevationDate){
      return function(db){
        var promiseFunction = function(resolve,reject){
          db.collection("WallDisplay").findOne({"abi":instituteId,"data":relevationDate},{"servizio.rilevazioni":{$slice:-1}},function(err,data){
            db.close();
            err?reject(err.message):resolve(data);
          });}
      return new Promise(promiseFunction)}
  }

  getServiceData(instituteId,serviceName,date){

  }

  getServicesTresholds(instituteId){
    this.mySqlConnection.connect();
    var connection = this.mySqlConnection;
    var resolveFunction = this._createTresholdObjectFromQueryResults;
    var promiseFunction = function(resolve, reject) {
      connection.query(queryTreshold,instituteId,function(err,queryResults){
        connection.end();
        err?reject(err.message):resolve(resolveFunction(queryResults));
      })};
    return new Promise(promiseFunction);
  }


  _createTresholdObjectFromQueryResults(queryResults){
    return queryResults.reduce(
      (accumulator,currentValue)=>{
        accumulator[currentValue.md_servizio]=currentValue.md_soglia;
        return accumulator;
      }
      ,{});
  }


  _getMongoConnectionPromise(){
    var mongo=this.mongodb;
    return new Promise(function(resolve, reject) {
      mongo.connect(urlMongodb,function(err,db){
      err?reject(err.message):resolve(db);
      });
    });
  }
}

module.exports = new DatabaseClient();//return a singleton
//var database=new DatabaseClient();
//database.addUser("06370","m.pp@CRVOLTERRA.it","12345","32323232").then(console.log)
//database.findUser("m.pp@CRVOLTERRA.it").then(console.log);
