var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Stockiest');
var MemberModel = mongoose.model('Member');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function find()
************************/
router.get('/find', authMiddleware, (req, res, next) => {

  var memberId = req.query.memberId;
  Model.find({ memberId: new RegExp('^' + memberId, 'i') }).populate('member').then(result => {

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
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
function findOne()
************************/
router.get('/find-one', authMiddleware, (req, res, next) => {

  var memberId = req.query.memberId;
  Model.findOne({ memberId }).populate('member').then(result => {

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result.member,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
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
router.get('/', authMiddleware, (req, res, next) => {

  // var data = req.query;

  Model.find({}).populate('member').then(result => {
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
function post()
************************/
router.post('/', authMiddleware, async (req, res, next) => {
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
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
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
