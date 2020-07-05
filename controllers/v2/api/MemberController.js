var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Member');

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
function find()
************************/
router.get('/find', (req, res, next) => {

  var memberId = req.query.memberId;

  Model.find({ memberId: new RegExp('^' + memberId, 'i') }).then(result => {

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
router.get('/find-one', (req, res, next) => {

  var memberId = req.query.memberId;
  Model.findOne({ memberId }).then(result => {

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
function getMemberPending()
************************/
router.get('/pending', authMiddleware, async (req, res, next) => {

  var sponsorId = req.decoded.memberId;
  var rsMember = await Model.find({ sponsorId, activation: 'Pending' }, [], {
    sort: { registeredOn: -1 },
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsMember,
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
function put()
************************/
router.put('/:id', authMiddleware, (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  var model = new Model(data);
  var error = model.validateSync();

  if (!error) {
    Model.findByIdAndUpdate(id, data).then(result => {
      res.json({
        state: 'success',
        message: 'Sukses, mengubah data',
        data: result,
      });
    }).catch(error => {
      res.json({
        state: 'failed',
        message: 'Gagal, mengubah data',
        data: error,
      });
    });
  }
  else
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: error,
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
