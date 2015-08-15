var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var path = require('path');
var uploadManager = require('./uploadManager')(router);

//window.$ = window.jQuery = require('jquery');
//global.jQuery = require('jquery');
//var bootstrap = require('bootstrap');

router.get('/addUser', function(req, res, next){
/*	fs.readFile(req.files.displayImage.path, function (err, data) {
		// ...
		var newPath = __dirname + "/uploads/uploadedFileName";
		fs.writeFile(newPath, data, function (err) {
		res.redirect("back");
	});
});*/
	res.render('addUser', { title: 'Pioneer Students' });
});

/* GET home page. */
router.get('/', function(req, res, next) {

	/*	
	//Convert latitude and longitude to coordinates for the map
	var latitude = 39.9491;
	var longitude = 75.1606;
        var longScale = 0.00970377347797255;
        var latScale = 0.005159573147276777;
        var longTrans = -166.80802006230326;
        var latTrans = 19.699997781345246;
        
        var specialLongitude = Math.abs((longitude+longTrans)/longScale);
        var specialLatitude = (latitude-latTrans)/latScale;
        //console.log("Longitude:" + specialLongitude + ", Latitude:" + specialLatitude);
	

	
	var options = {host:'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBkL_7hj4jZVeDJS0TDy1sdME8DOXG_diI'}
	

	var geocoder;
	var map;
	  geocoder = new google.maps.Geocoder();
	  var address = document.getElementById('address').value;
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
		console.log('mabes');
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });



	//Read in the usa cities json (for eventual writing)
	fs.readFile('public/json/cities_usa.topo.json', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var json_obj = JSON.parse(data);
	        //console.log(json_obj.objects.cities.geometries);
	});

	//SQL QUERYING
	// -----------
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
	*/
	res.render('index', { title: 'Pioneer Students' });
});

module.exports = router;
