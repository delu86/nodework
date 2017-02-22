class InstituteInformationRetriever {
  constructor() {//id is the abi_code of the Institute
    this.instituteDataManager = require('./database/instituteDataManager.js');

  }
  getInstituteLastServicesRelevation(instituteId,relevationDate){
    try{
      return this.instituteDataManager.getInstituteLastRelevationOnDate(instituteId,relevationDate);
    }
    catch(err){
      console.log(err);
    }
  }
  getServiceInformationOnDate(instituteId,date,serviceName){
    try {
    return  this.instituteDataManager.getServiceInformationOnDate(instituteId,date,serviceName);
    } catch (e) {
      console.log(e);
    }
  }
  getMetadata(){
    return this.instituteDataManager.getMetadata();
  }
  getInstituteServicesTresholds(instituteId){
    try{
      return this.instituteDataManager.getServicesTresholds(instituteId);
    }
    catch(err){
      console.log(err);
    }
  }
  getInstituteServiceData(serviceName,instituteId,date){
    try{
      return this.instituteDataManager.getServiceData(serviceName,instituteId,date);
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
