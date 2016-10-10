var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
io.on('connection', function(socket){
 
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
    socket.on('new connection', function(msg){
    io.emit('new connection', msg);
  });
    socket.on('new disconnection',function(msg){
    	io.emit('new disconnection', msg);
    });
});