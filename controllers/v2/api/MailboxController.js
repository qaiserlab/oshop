var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var messager = require('../../../helpers/messager');

var Model = mongoose.model('Mailbox');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function get()
************************/
router.get('/', authMiddleware, (req, res, next) => {

  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  if (fromDate && toDate) {
    var xFromDate = fromDate.split('-');
    var xToDate = toDate.split('-');

    var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
    var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
    dToDate.setDate(dToDate.getDate() + 1);

    var criteria = {
      postedOn: {
        $gte: dFromDate,
        $lt: dToDate,
      },
    };
  }
  else var criteria = {};

  Model.find(criteria).then(result => {
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

  if (!data.name)
    errors.name = { message: 'Nama belum diisi' };

  if (!data.email)
    errors.email = { message: 'Email belum diisi' };

  if (!data.subject)
    errors.subject = { message: 'Subjek required' };

  if (!data.message)
    errors.message = { message: 'Pesan belum diisi' };

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

  var postedOn = Date.now();
  data.postedOn = postedOn;

  var email = 'f.anaturdasa@gmail.com';
  messager.sendMailSpecific(
    data.email,
    data.name,
    [email],
    data.subject,
    '<sup>Dari: ' + data.name + ', Email: ' + data.email + '</sup>' +
    '<p>' +
    data.message +
    '</p>'
  );

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
