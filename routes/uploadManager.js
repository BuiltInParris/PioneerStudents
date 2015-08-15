var imageOptions = {
  tmpDir: __dirname + '/../public/uploaded_images/tmp',
  uploadDir: __dirname + '/../public/uploaded_images/files',
  uploadUrl: '/uploaded_images/files/',
  storage: {
    type: 'local'
  }
};

var jsonOptions = {
  tmpDir: __dirname + '/../public/json/tmp',
  uploadDir: __dirname + '/../public/json',
  uploadUrl: '/public/json',
  storage: {
    type: 'local'
  }
};


var imageUploader = require('blueimp-file-upload-expressjs')(imageOptions);
var jsonUploader = require('blueimp-file-upload-expressjs')(jsonOptions);


module.exports = function(router) {
  router.get('/upload_image', function(req, res) {
    imageUploader.get(req, res, function(obj) {
      console.log(obj);
      res.send(JSON.stringify(obj));
    });
  });

  router.post('/upload_image', function(req, res) {
    imageUploader.post(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });

  router.post('/newuser', function(req, res) {
    jsonUploader.post(req, res, function(obj) {
	res.send(JSON.stringify(obj));
    });
  });


  router.delete('/uploaded_images/files/:name', function(req, res) {
    imageUploader.delete(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });

  return router;
};
