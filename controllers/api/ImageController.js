var mongoose = require('mongoose');
var slugify = require('slugify');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Image');

var upload = require('../../helpers/upload');

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

function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.title)
    errors.title = { message: 'Judul belum diisi' };

  if (!data.image)
    errors.image = { message: 'Gambar belum diisi' };

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
router.post('/', validate, async (req, res, next) => {
  var data = req.body;

  var slug = slugify(data.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var image = upload.save(data.image, slug);
  var postedOn = Date.now();

  data.slug = slug;
  data.image = image;
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
router.put('/:id', validate, (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  var slug = slugify(data.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var image = upload.save(data.image, slug);

  data.slug = slug;
  data.image = image;

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
router.delete('/:id', (req, res, next) => {
  var id = req.params.id;

  Model.findByIdAndRemove(id, (error, data) => {

    upload.remove(data.image);

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
