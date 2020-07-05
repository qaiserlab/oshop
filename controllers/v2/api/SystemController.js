var express = require('express');
var fs = require('fs');
var multer = require('multer');

var router = express.Router();

var config = require('../../../config');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function config()
************************/
router.get('/config', (req, res, next) => {
  var apiKey = config.apiKey;
  var archivesUrl = config.archivesUrl;

  res.json({
    state: 'success',
    message: 'Read configuration success',
    data: {
      apiKey,
      archivesUrl,
    },
  });
});

/************************
function upload()
************************/
var upload = multer({ dest: 'public/writable/tmp' });
router.post('/upload', upload.single('fileActive'), (req, res, next) => {
  var extension = req.query.extension || 'png';

  var data = req.body;
  var file = req.file;

  fs.renameSync('public/writable/tmp/' + file.filename, 'public/writable/tmp/' + file.filename + '.' + extension);

  res.json({
    state: 'success',
    message: 'File upload success',
    data: {
      url: config.tmpUrl + '/' + file.filename + '.' + extension,
      file: file.filename + '.' + extension,
    },
  });
});

module.exports = router;
