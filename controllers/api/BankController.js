var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Bank');

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

  if (!data.bank)
    errors.bank = { message: 'Nama Bank belum diisi' };

  if (!data.accountNumber)
    errors.accountNumber = { message: 'No. Rekening belum diisi' };

  if (!data.accountName)
    errors.accountName = { message: 'Nama Pemilik belum diisi' };

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
