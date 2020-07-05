var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Setting');

/************************
function get()
************************/
router.get('/', (req, res, next) => {

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

  if (!data.pinPrice)
    errors.pinPrice = { message: 'Harga PIN belum diisi' };

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
function put()
************************/
router.put('/', validate, (req, res, next) => {
  var id = 1;
  var data = req.body;

  Model.count({ settingId: id }).then(count => {
    console.log('count: ' + count);
    if (count >= 1) {
      Model.findOneAndUpdate({ settingId: id }, data).then(result => {
        res.json({
          state: 'success',
          message: 'Harga PIN telah tersimpan',
          data,
        });
      }).catch(error => {
        res.json({
          state: 'failed',
          message: 'Gagal, mengubah data',
          data: error,
        });
      });
    }
    else {
      data.settingId = id;
      Model.create(data).then(result => {
        res.json({
          state: 'success',
          message: 'Harga PIN telah tersimpan',
          data: result,
        });
      }).catch(error => {
        res.json({
          state: 'failed',
          message: 'Gagal, membuat data',
          data: error,
        });
      });
    }
  });


});

module.exports = router;
