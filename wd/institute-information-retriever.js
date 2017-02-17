class InstituteInformationRetriever {
  constructor() {//id is the abi_code of the Institute
    this.databaseClient = require('./database');

  }
  getInstituteServicesRelevation(instituteId,relevationDate){
    try{
      return this.databaseClient.getInstituteRelevationOnDate(instituteId,relevationDate);
    }
    catch(err){
      console.log(err);
    }
  }
  getServiceInformationOnDate(instituteId,date,serviceName){
    try {
    return  this.databaseClient.getServiceInformationOnDate(instituteId,date,serviceName);
    } catch (e) {
      console.log(e);
    }
  }
  getMetadata(){
    return this.databaseClient.getMetadata();
  }
  getInstituteServicesTresholds(instituteId){
    try{
      return this.databaseClient.getServicesTresholds(instituteId);
    }
    catch(err){
      console.log(err);
    }
  }
  getInstituteServiceData(instituteId,serviceName,date){
    try{
      return this.databaseClient.getServiceData(instituteId,serviceName,date);
    }
    catch(err){
      console.log(err);
    }
  }
}
module.exports = new InstituteInformationRetriever();//return a singleton
//var info=new InstituteInformationRetriever();
//info.getInstituteServicesRelevation("06370","2017-02-01").then(JSON.stringify)
//                                                         .then(console.log)
//                                                         .catch(console.log)//.then(console.log)
