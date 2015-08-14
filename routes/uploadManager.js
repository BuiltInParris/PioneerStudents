
var options = {
  tmpDir: __dirname + '/../public/uploaded_images/tmp',
  uploadDir: __dirname + '/../public/uploaded_images/files',
  uploadUrl: '/uploaded_images/files/',
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

module.exports = function(router) {
  router.get('/upload', function(req, res) {
    uploader.get(req, res, function(obj) {
      console.log(obj);
      res.send(JSON.stringify(obj));
    });
  });

  router.post('/upload', function(req, res) {
    uploader.post(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });

  router.delete('/uploaded_images/files/:name', function(req, res) {
    uploader.delete(req, res, function(obj) {
      res.send(JSON.stringify(obj));
    });
  });
  return router;
};
