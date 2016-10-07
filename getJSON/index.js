var http=require("http");
var url="http://kiroom.cedacri.it/epvMonitorMobile/epvJsonInfo";


http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        //var fbResponse = JSON.parse(body);
        console.log("Got a response: ", body);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});

 