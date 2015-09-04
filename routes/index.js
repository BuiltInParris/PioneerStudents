var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var path = require('path');
var uploadManager = require('./uploadManager')(router);
var ncp = require('ncp').ncp;
var fs = require('fs');
var geocoder = require('geocoder');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++

module.exports = function(passport){
router.get('/addUser', isAuthenticated, function(req, res, next){
	console.log(req);
	/*fs.readFile(req.files.displayImage.path, function (err, data) {
		// ...
		var newPath = __dirname + "/uploads/uploadedFileName";
		fs.writeFile(newPath, data, function (err) {
		res.redirect("back");
	});
});*/
	res.render('addUser', { title: 'Pioneer Students' });
});

router.get('/deleteUser', isAuthenticated, function(req, res, next){
        res.render('deleteUser', { title: 'Pioneer Students' });
});

router.get('/userPanel', isAuthenticated, function(req, res, next){
        res.render('userPanel', { title: 'Pioneer Students' });
});

router.post('/createuser', isAuthenticated, function(req,res){

	var state = "";

	var name = req.body.firstname + " " + req.body.lastname;

	var username = req.body.username;

	var image = req.body.username + ".jpg";
	
	var description = req.body.description;

	var university = req.body.university;

        var options = {host:'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.city.replace(/ /g, '+')  + '&key=AIzaSyBkL_7hj4jZVeDJS0TDy1sdME8DOXG_diI'}
        

	var country = "";

        geocoder.geocode(req.body.city, function(err, data) {
		var components = data.results[0].address_components;
		for(var x = 0; x < components.length; x++)
		{
			if(components[x].types[0] == "administrative_area_level_1")
			{
				state = components[x].long_name;
			}
			if(components[x].types[0] == "country")
			{
				country = components[x].short_name
			}
		}
		
		var location = data.results[0].geometry.location
		var latitude = parseFloat(location.lat)
		var longitude = parseFloat(location.lng)

		//Convert latitude and longitude to coordinates for the map
        	var longScale = 0.00970377347797255;
	        var latScale = 0.005159573147276777;
        	var longTrans = -166.80802006230326;
	        var latTrans = 19.699997781345246;
	        var specialLongitude = Math.abs((Math.abs(longitude)+longTrans)/longScale);
        	var specialLatitude = (latitude-latTrans)/latScale;

		 //Read in the usa cities json
	        fs.readFile('public/json/cities_' + country.toLowerCase() + '.topo.json', 'utf8', function (err,data) {
        	        if (err) {
                	        return console.log(err);
			}
                	var json_obj = JSON.parse(data);
			var cityJSON = json_obj.objects.cities.geometries;
			var newCity = JSON.parse('{"type": "Point","properties": {"state": "' + state  + '","name": "' + name + '","username": "' + username + '","university": "' + university + '","image": "'+ image + '","description": "' + description + '"},"coordinates": [' + Math.round(specialLongitude)  + ',' + Math.round(specialLatitude) + ']}');
			cityJSON.push(newCity);
			json_obj.objects.cities.geometries = cityJSON;
			fs.writeFile("./public/json/" + "cities_" + country.toLowerCase()  + ".topo.json", JSON.stringify(json_obj), function(err) {
                        	if(err) {
                                	return console.log(err);
                                }
                        });
        	});
        });

	res.redirect('/addUser');
	//if the file exists
	if (!createWebsite(req.body.username)) {
		console.log("error wha");
		res.render('error', { status: req.body.status});
	} else {
		res.render('redirectToGhost', { username: req.body.username});
	}
	//add res.body information to database, and write to the map json as well.
});

router.post('/removeuser', isAuthenticated, function(req,res){

	//if the file exists
        if (!removeWebsite(req.body.username)) {
		res.render('error', { username: 'Username/website doesn\'t exist.'});
        } else {
		//Read in the usa cities json (for eventual writing)
                fs.readFile('public/json/cities_' + req.body.country.toLowerCase() + '.topo.json', 'utf8', function (err,data) {
                        if (err) {
                                return console.log(err);
                        }
                        var json_obj = JSON.parse(data);
                        var cityJSON = json_obj.objects.cities.geometries;
                        for(var x = 0; x < cityJSON.length; x++)
                	{
                        	if(cityJSON[x].properties.username == req.body.username)
                	        {
	                        	cityJSON.pop(x);
				}
			}
			json_obj.objects.cities.geometries = cityJSON;
                        fs.writeFile("./public/json/" + "cities_" + req.body.country.toLowerCase()  + ".topo.json", JSON.stringify(json_obj), function(err) {
                                if(err) {
                                        return console.log(err);
                                }
                        });
                });

                res.redirect('/deleteUser');
        }
});



/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Pioneer Students' });
});

function createWebsite(username){
	console.log("Creating website for username: " + username);
        source = "./node_modules/ghost";
        destination = "./node_modules/" + username;
	if(fs.existsSync(destination) == false)
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
				fs.readFile('./data/portNum.txt', 'utf8', function read(err, portNum) {
					lastPortNumber = parseInt(portNum);
					newPortNumb1 = (lastPortNumber + 1).toString();
					newPortNumb2 = (lastPortNumber + 2).toString();
					data = data.replace(new RegExp(oldurl, 'g'),newurl);
					data = data.replace(new RegExp(portNumb1, 'g'),newPortNumb1);
					data = data.replace(new RegExp(portNumb2, 'g'),newPortNumb2);
					data = data.replace(new RegExp('http://localhost:' + newPortNumb1, 'g'),'http://localhost:'+newPortNumb1+'/'+username);
					fs.writeFile(destination + "/config.js", data, function(err) {
						if(err) {
							return console.log(err);
						}
					});
					fs.writeFile('./data/portNum.txt', newPortNumb2, function(err) {
						if(err) {
							return console.log(err);
						}
					});
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
function removeWebsite(username){
        console.log("Deleting website for username: " + username);
        destination = "./node_modules/" + username;

	if(fs.existsSync(destination) == true)
        {
                //if the file exists
		rmdir(destination);
                //Modifying app.js to add remove require and remove ghostserver. Replaces comment in place.
		fs.readFile('./app.js', 'utf8', function read(err, data) {
			var requireSearchStr = "var " + username + " = require(\'" + username + "\');";
			var routeSearchStr = username + "().then(function (ghostServer) { app.use(\'/" + username + "\', ghostServer.rootApp);ghostServer.start(app);});";
			data = data.replace(requireSearchStr+"\n","");
			data = data.replace(routeSearchStr+"\n","");
			fs.writeFile("./app.js", data, function(err) {
				if(err) {
					return console.log(err);
				}
			});
		});
                return true;
        } else {
                return false;
        }
}

function rmdir(path, callback) {
	fs.readdir(path, function(err, files) {
		if(err) {
			// Pass the error on to callback
			callback(err, []);
			return;
		}
		var wait = files.length,
			count = 0,
			folderDone = function(err) {
			count++;
			// If we cleaned out all the files, continue
			if( count >= wait || err) {
				fs.rmdir(path,callback);
			}
		};
		// Empty directory to bail early
		if(!wait) {
			folderDone();
			return;
		}
		
		// Remove one or more trailing slash to keep from doubling up
		path = path.replace(/\/+$/,"");
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if( err ) {
					callback(err, []);
					return;
				}
				if( stats.isDirectory() ) {
					rmdir(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

	
	// GET login page
	router.get('/login', function(req, res){
		res.render('login', {message: req.flash('message')});
	});

	// Handle Login POST 
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/userPanel',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', isAuthenticated, function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	router.post('/signup', isAuthenticated, passport.authenticate('signup', {
		successRedirect: '/userPanel',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/signout', isAuthenticated,function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
