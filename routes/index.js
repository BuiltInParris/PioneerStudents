var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//window.$ = window.jQuery = require('jquery');
//global.jQuery = require('jquery');
//var bootstrap = require('bootstrap');



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Pioneer Students' });
	
	var connection = mysql.createConnection({
        	host : "localhost",
        	user : "pioneer",
        	password : "yeOldHomestead"
	});

	connection.connect();

	connection.query("use PioneerStudents");
	var strQuery = "SELECT * FROM test";
	//var strQuery = "INSERT INTO test (col1) VALUES('mayhaps');";

	connection.query(strQuery, function(err, rows){
		if(err){
                	throw err;
		}
        	else
        	{
			console.log(rows)
        	}
	});
});

module.exports = router;
