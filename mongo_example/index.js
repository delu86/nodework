var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var url= "mongodb://10.99.252.22:27017/FAC";
var ObjectId= require('mongodb').ObjectID;

MongoClient.connect(url,function(err,db) {
	assert.equal(null,err);
	console.log("Connected correctly to the server");
	findDocuments(db, function() {
      db.close();
  })
	
});
function insertCallback(db) {
	db.close();
}
function findDocuments(db,callback) {
	var lastDoc=db.collection("WallDisplay").findOne({"abi":"06370"},{"servizio.rilevazioni":{$slice:-1}},showDocument)
	callback();
}
function showDocument(err,doc) {
	assert.equal(err,null);
	if(doc!=null){
		/*Displays an interactive list of the properties of the specified JavaScript object. The output is presented 
		  as a hierarchical listing with disclosure triangles that let you see the contents of child objects.*/
		console.log("Document date: "+doc.data);
		console.log("Servizi rilevati:");
		doc.servizio.forEach(function(element){
			console.log("********Nome servizio:"+element.nomeservizio);
			console.log("********Ultimea rilevazione:"
				+element.rilevazioni[0].
				logtime);
		})
	}
}
