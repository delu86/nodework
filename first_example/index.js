const http = require('http');
const express = require('express');
const path = require('path');

var app=express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));
app.get('/', indexGet);
app.get('/temp', tempGet);
app.get('/dyn/:a?/:b?/:c?',dynamicPath);


http.createServer(app).listen(app.get('port'),createServerCallback);

function createServerCallback() {
  console.log("Server running on port 3000");
}

function indexGet(req,res) {
    res.send('<html><body><h1>Hello World</h1></body></html>');
  }
function tempGet(req,res) {
      res.send('<html><body><h1>Ci sono 30°</h1></body></html>');
  }
function dynamicPath(req,res) {
  res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
}
