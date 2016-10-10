var express=require("express");
var app=express();
var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId= require('mongodb').ObjectID;
var bodyParser=require("body-parser");
var path = require('path');
var http=require('http').Server(app);
var io = require('socket.io')(http);
var url= "mongodb://10.99.252.22:27017/FAC";
app.use(express.static(path.join(__dirname,'views')));
app.use('/bootstrap',express.static('C:/Users/cre0260/node/node_modules/bootstrap'));
app.set('views',__dirname+'/views');
//set up jade as view engine
app.set('view engine','pug');
//start server on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/getJSON/:abi_code',getJSON);
app.get('/card',getCard);
app.get('/:abi_code',getWallDisplay);

function getWallDisplay(req,res) {
	    connection_id = Math.floor(Math.random() * 1000);
		res.render('wallDisplay.jade',{connection_id:connection_id,abi_code:req.params.abi_code});
}
function getCard(req,res) {
	res.render('walle.pug');
}
function getJSON(req,res) {
	MongoClient.connect(url,function(err,db) {
		try{
		assert.equal(null,err);
		db.collection("WallDisplay").findOne({"abi":req.params.abi_code},{"servizio.rilevazioni":{$slice:-1}},
		function(err,doc){
			var json=JSON.stringify(doc);
			res.end(json)
		});}
		catch(e){
			console.log("Error on db: "+e);
		}
	});
}
io.on('connection', function(socket){
	// console.log("new connection");
	socket.on('json request', function(id){
   		MongoClient.connect(url,function(err,db) {
		assert.equal(null,err);
        db.collection("WallDisplay").findOne({"abi":id.split("_")[0]},{"servizio.rilevazioni":{$slice:-1}},
			function(err,doc){
				// console.log(id);
				var json=JSON.stringify(doc);
				io.emit('json '+id+' response', json);
			});
  		});
	});
});
