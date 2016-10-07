var express=require("express");
var session=require("express-session");
var bodyParser=require("body-parser");

var app=express();
app.set('views',__dirname+'/views');
app.set('view engine','jade');

app.use(session({secret:'sssshhh',
                 resave:true,
                saveUninitialized:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var session;
app.get('/',getHome);
app.post('/login',postLogin);
app.get('/logout',getLogout);
app.get('/hello', getHello);
app.listen(3000,function(){
    console.log("App Started on PORT 3000");
});

function getHome(req,res) {
	res.render('first.jade');
}
function postLogin(req,res) {
	session=req.session;
	session.username=req.body.username;
	res.end('ok');
}
function getLogout(req,res) {
	req.session.destroy();
	res.end('done');
}
function getHello(req,res) {
	session=req.session;
	if(session.username)
		res.render('hello.jade',{username:session.username});
	else
		res.render('first.jade');
}