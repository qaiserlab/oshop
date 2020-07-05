var mongoose = require('mongoose');
var slugify = require('slugify');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Page');

var upload = require('../../../helpers/upload');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function get()
************************/
router.get('/', (req, res, next) => {

  // var data = req.query;

  Model.find({}).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membaca data',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

/************************
function get()
************************/
router.get('/find-one', (req, res, next) => {

  var slug = req.query.slug;

  Model.findOne({ slug }).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membaca data',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.title)
    errors.title = { message: 'Judul belum diisi' };

  if (!data.publication)
    errors.publication = { message: 'Publikasi belum diisi' };

  if (Object.keys(errors).length > 0)
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });
  else
    next();
}

/************************
function post()
************************/
router.post('/', authMiddleware, validate, async (req, res, next) => {
  var data = req.body;

  var slug = slugify(data.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var featuredImage = upload.save(data.featuredImage, slug);
  var postedOn = Date.now();

  data.slug = slug;
  data.featuredImage = featuredImage;
  data.postedOn = postedOn;

  var model = new Model(data);

  model.save().then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membuat data baru',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membuat data baru',
      data: error,
    });
  });

});

/************************
function put()
************************/
router.put('/:id', authMiddleware, validate, (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  var slug = slugify(data.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var featuredImage = upload.save(data.featuredImage, slug);

  data.slug = slug;
  data.featuredImage = featuredImage;

  Model.findByIdAndUpdate(id, data).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, mengubah data',
      data,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, mengubah data',
      data: error,
    });
  });

});

/************************
function delete()
************************/
router.delete('/:id', authMiddleware, (req, res, next) => {
  var id = req.params.id;

  Model.findByIdAndRemove(id, (error, data) => {

    upload.remove(data.featuredImage);

    if (!error)
      res.json({
        state: 'success',
        message: 'Sukses, menghapus data',
        data,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, menghapus data',
        data: error,
      });
  });

});

module.exports = router;
