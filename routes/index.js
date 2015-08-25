var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var path = require('path');
var uploadManager = require('./uploadManager')(router);
var ncp = require('ncp').ncp;
var fs = require('fs');

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

router.post('/createuser', function(req,res){

	//if the file exists
	if (createWebsite(req.body.username)) {
		res.redirect('/addUser');
	}
	else {
		res.render('error', { title: 'Username/website already exists.'});
	}
	//add res.body information to database, and write to the map json as well.
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

function createWebsite(username){
	console.log("Creating website for username: " + username);
        source = "./node_modules/ghost";
        destination = "./node_modules/" + username;

	if(!fs.exists(destination))
	{
		//if the file exists
		//copy file from source to destination
		ncp(source, destination, function (err) {
			if (err) {
				return console.error(err);
			}
			//replace config.js with the example version
			oldFile = fs.createReadStream(destination + "/config.example.js");
			newFile = fs.createWriteStream(destination + "/config.js");
			oldFile.pipe(newFile);
			//modify config.js using the new username
			fs.readFile(destination + '/config.js', 'utf8', function read(err, data) {
				if (err) {
					throw err;
				}

				//Change URLS and port numbers
				oldurl = "my-ghost-blog.com"
				newurl = "PioneerStudents.net"
				portNumb1 = "2368";
				portNumb2 = "2369";

				//This will need to be stored in a database and incremented as we go
				lastPortNumber = "2750";
				newPortNumb1 = (parseInt(lastPortNumber) + 1).toString();
				newPortNumb2 = (parseInt(lastPortNumber) + 2).toString();
				data = data.replace(new RegExp(oldurl, 'g'),newurl);
				data = data.replace(new RegExp(portNumb1, 'g'),newPortNumb1);
				data = data.replace(new RegExp(portNumb2, 'g'),newPortNumb2);
				data = data.replace(new RegExp('http://localhost:' + newPortNumb1, 'g'),'http://localhost:'+newPortNumb1+'/'+username);
				fs.writeFile(destination + "/config.js", data, function(err) {
					if(err) {
						return console.log(err);
					}
				});
			});

			//Modifying app.js to add require and new ghostserver. Replaces comment in place.
			fs.readFile('./app.js', 'utf8', function read(err, data) {
				requireStr = "var " + username + " = require('" + username + "');";
				requireSearchStr = "// -- Please don't touch -- ghost require creation -- //";
				routeStr = username + "().then(function (ghostServer) { app.use('/" + username + "', ghostServer.rootApp);ghostServer.start(app);});";
				routeSearchStr = "// -- Please don't touch -- ghost route creation -- //";
				data = data.replace(new RegExp(requireSearchStr, 'g'),requireStr + '\n' + requireSearchStr);
				data = data.replace(new RegExp(routeSearchStr, 'g'),routeStr + '\n' + routeSearchStr);
				fs.writeFile("./app.js", data, function(err) {
					if(err) {
						return console.log(err);
					}
				});
			});

		});
		return true;
	} else {
		return false;
	}
}


module.exports = router;
