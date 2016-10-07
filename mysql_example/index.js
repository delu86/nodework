var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '10.99.252.23',
  user     : 'cedacri',
  password : 'cedacri',
  database : 'smfacc'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});



function hello(argument) {
	console.log("ciao");
}
