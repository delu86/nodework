
const express = require('express');
const session = require('express-session');
/*
 * body-parser is a piece of express middleware that 
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body` 
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */
const bodyParser = require('body-parser');
var app= express();

app.set('views',__dirname+'/views');
app.engine('html', require('ejs').renderFile);


app.use(session({secret:'sssshhh',
                 resave:true,
                saveUninitialized:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var sess;

app.get('/',homeFunction);
app.post('/login',loginFunction);
app.get('/admin',adminFunction);
app.get('/logout',logoutFunction);
app.listen(3000,function(){
    console.log("App Started on PORT 3000");
});
function homeFunction(req,res) {
  sess=req.session;
  sess.email? res.redirect('/admin'):res.render('index.html');
}

function loginFunction(req,res) {
  sess=req.session;
  sess.username=req.body.username;
  res.end('done')
}

function adminFunction(req,res) {
  sess = req.session;
  if(sess.email) {
      res.write('<h1>Hello '+sess.email+'</h1>');
      res.end('<a href="/logout">Logout</a>');
    } else {
      res.write('   <h1>Please login first.</h1>');
      res.end('<a href="/">Login</a>');
    }
}

function logoutFunction(req,res) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }});
}
