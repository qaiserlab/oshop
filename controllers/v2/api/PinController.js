var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Pin');
var PinStockModel = mongoose.model('PinStock');
var MemberModel = mongoose.model('Member');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

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
function find()
************************/
router.get('/find', (req, res, next) => {

  var pin = req.query.pin;

  Model.find({ pin: new RegExp('^' + pin, 'i') }).populate('member').then(result => {

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

  var pin = req.query.pin;
  Model.findOne({ pin }).populate('member').then(result => {

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
function post()
************************/
router.post('/', authMiddleware, async (req, res, next) => {
  var data = req.body;
  var errors = {};

  if (!data.quantity || parseInt(data.quantity) == 0)
    errors.quantity = { message: 'Quantity required' };

  if (data.useSponsor) {
    if (!data.sponsorId)
      errors.sponsorId = { message: `Sponsor ID belum diisi` };
    else {
      var rowMember = await MemberModel.findOne({ memberId: data.sponsorId });

      if (!rowMember)
        errors.sponsorId = { message: `Sponsor dengan ID Sponsor '${data.sponsorId}' tidak terdaftar sebagai Member` };
    }
  }

  if (Object.keys(errors).length > 0)
    return res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });

  if (data.useSponsor) {
    var memberId = data.sponsorId;
    var date = Date.now();
    var description = 'Penambahan PIN';
    var in_ = data.quantity;
    var out_ = 0;

    PinStockModel.create({
      memberId,
      date,
      description,
      'in': in_,
      'out': out_,
    });
  }

  var sponsorId = (rowMember?rowMember._id:'');

  var allData = data.rsPin.map(row => {
    var _row = {
      serialNumber: row.sn,
      pin: row.pin,
      isActive: 0,
      status: 0,
    };

    if (sponsorId) {
      _row.sponsorId = data.sponsorId;
      _row.sponsor = sponsorId;
    }

    return _row;
  });

  Model.create(allData).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membuat data baru',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Create data failed;',
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
