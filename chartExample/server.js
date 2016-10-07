var express=require("express");
var mysql=require("mysql");
var path = require('path');
var app=express();

const QUERY='SELECT date(start) as date, round(sum(duration)/3600)as ore_indisp from atm_indisponibili where substr(start,1,7)=\'2016-07\' group by date(start) order by 1 asc;';

app.use(express.static(path.join(__dirname,'views')));
app.set('views',__dirname+'/views');
app.set('view engine','jade');

var connection = mysql.createConnection({
	  host     : '10.99.252.23',
  	  user     : 'cedacri',
      password : 'cedacri',
      database : 'atm_stat'
});
app.listen(3000,function(){
    console.log("App Started on PORT 3000");
});

app.get("/",getHome);
app.get("/atm30gg",getJSON);


function getJSON(req,res){
	//url parameter
	console.log(req.query.period);
	connection.query(QUERY,function(err,rows,fields){
		onQueryExecuted(err,rows,fields,req,res);
	});
}
function getHome(req,res) {
	res.render('chart.jade');
}
function onQueryExecuted(err,rows,fields,req,res) {
	//error handling
	//for more information on error handling
	//https://www.joyent.com/node-js/production/design/errors
	if(err){
		console.error('Errore nella connessione al db', err);
		return;	
	} 
	var result=[];
	for (var i = rows.length - 1; i >= 0; i--) {
		result.push({
			date:rows[i].date,
			ore_indisp:rows[i].ore_indisp
		});}
	res.contentType('application/json');
	res.send(JSON.stringify(result));
}