    var express=require("express");
    var app=express();
    var mysql = require('mysql');
    var MongoClient = require("mongodb").MongoClient;
    var assert = require("assert");
    var ObjectId= require('mongodb').ObjectID;
    var bodyParser=require("body-parser");
    var path = require('path');
    var http=require('http').Server(app);
    var io = require('socket.io')(http);
    var urlMongodb= require('./constant.js').urlMongodb;
    var mySqlConnectionProperties=require('./constant.js').mySqlConnectionProperties;
    var chartsData = require('./chartsData');
    var servicesData = require('./servicesData');
    var abiDescription = require('./abiDescription');
    var metaData;
    app.use(express.static(path.join(__dirname,'views')));
    app.set('views',__dirname+'/views');
    //set up jade as view engine
    app.set('view engine','pug');

    //start server on port 80
    http.listen(80, function(){
      console.log('listening on *:80');
      try {
          setUpMetadata();
          console.log("Setup of metadata...done!");
      } catch (e) {
        console.log(e);
      }
    });

    //socket io for long polling
      io.on('connection', function(socket){
         try {
           // console.log("new connection");
         	socket.on('json request', function(id){
            		MongoClient.connect(urlMongodb,function(err,db) {
                  /*
                  params[0]=abi
                  params[1]=date yyyy-mm-dd
                  params[2]=connection id
                  */
                  var params=id.split("_");//abi_yyyy-mm-dd_id
                  //console.log(params[1]);
                  sendJSONWallDisplay(params[0],params[1],err,db,function(json){
                       //console.log(id);
                       io.emit('json '+params[0]+'_'+params[2]+' response', json);
                       db.close();
                  });//end sendJSON callback
         	      });//end MongoClient.connect callback
              });
         }catch (e) {
          console.log("Error on db: "+e);
         }
        });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.get('/',getIndex);
    app.get('/index.html',getIndex);
    app.get('/getAbiDescription',getAbiDescription);
    app.get('/getJSON/:abi_code',getJSONWallDisplay);
    app.get('/getJSON/:abi_code/:service_name',getJSONCharts);
    app.get('/servicePage',getServiceDetailPage);
    app.get('/serviceDetailJSON',getServiceDetailJSON);
    app.get('/favicon.ico',function(req,res) {});
    app.get('/:abi_code',getWallDisplay);

    function getIndex(req,res) {
      res.render('index.html');
    }

    function getAbiDescription(req,res) {
      res.end(JSON.stringify(
        {
          description:abiDescription.getAbiDescription(req.query.abi)
        }
      ))
    }

    function getWallDisplay(req,res) {
        var abi=req.params.abi_code;
        connection_id = Math.floor(Math.random() * 1000);
        if(abiDescription.getAbiCode(abi)===req.query.code)
          res.render('wallDisplay.jade',{connection_id:connection_id,abi_code:abi,date:req.query.data,code:abiDescription.getAbiCode(abi)});
        else
          res.render('error.jade');
    }

    function getServiceDetailPage(req,res) {
      var abi=req.query.abi;
      if(abiDescription.getAbiCode(abi)===req.query.code)
        res.render('service.jade',{abi:req.query.abi,service:req.query.service,date:req.query.date,code:req.query.code});
      else
        res.render('error.jade');
    }

    function getServiceDetailJSON(req,res) {
      try{
        var abi=req.query.abi;
        if(abiDescription.getAbiCode(abi)===req.query.code)
          servicesData.getJSONData(res,req.query.service,abi,req.query.date);
        else
          res.render('error.jade');
      }
      catch(e){
        console.log(e)
      }
    }

    //get JSON data for wallDisplay chart
    function getJSONCharts(req,res) {
      try{
        var abi=req.params.abi_code;
        if(abiDescription.getAbiCode(abi)===req.query.code)
          chartsData.getData(abi,req.query.data,req.params.service_name,MongoClient,res);
        else
          res.render("error.jade");

      } catch (e) {
        console.log(e);
      }
    }

    //get JSON document for the creation of the wallDisplay
    function getJSONWallDisplay(req,res) {
      try{
    	   MongoClient.connect(urlMongodb,function(err,db) {
           var abi=req.params.abi_code;
           if(abiDescription.getAbiCode(abi)===req.query.code)
            sendJSONWallDisplay(abi,req.query.data,err,db,function(json){
                db.close();
                res.end(json);});
           else
             res.render("error.jade");

    	});
    }
      catch(e){
      console.log("Error on db: "+e);
    }};

    //set up metadata at server startup
    function setUpMetadata(){
      MongoClient.connect(urlMongodb,function(err,db) {
        db.collection("WallDisplayMetadata").findOne({},
          function(err,data){
            metaData=data;
          })
      });
    }

    function sendJSONWallDisplay(abi,date,errorConnection,db,callback){
      assert.equal(null,errorConnection);
      //get the last relevation
      db.collection("WallDisplay").findOne({"abi":abi,"data":date},{"servizio.rilevazioni":{$slice:-1}},
        function(err,lastRel){
          //console.log(JSON.stringify(lastRel));
          var json="{\"lastRel\":"+JSON.stringify(lastRel);
          json=json+" ,\"metaData\":"+JSON.stringify(metaData);
          var mySqlConnection = mysql.createConnection(mySqlConnectionProperties);
          var queryTreshold="SELECT md_servizio,if(md_servizio='TICKET',round(md_soglia),md_soglia) as md_soglia from md.wd_soglie where md_abi=? and md_servizio in ('TICKET','PWS','HB','CBI','FEU') order by md_data desc,md_abi;";
          mySqlConnection.connect();
          mySqlConnection.query(queryTreshold,abi,function(err, queryResults) {
            var treshold={};
            for(var i=0;i<queryResults.length;i++){
              treshold[queryResults[i].md_servizio]=queryResults[i].md_soglia;
            }
            json=json+",\"tresholds\":"+JSON.stringify(treshold)+"}"
            callback(json);
          });
          mySqlConnection.end();
            });
    }
