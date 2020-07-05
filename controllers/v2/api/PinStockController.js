var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var PinModel = mongoose.model('Pin');
var PinStockModel = mongoose.model('PinStock');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function get()
************************/
router.get('/', authMiddleware, (req, res, next) => {

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
function myPinHistory()
************************/
router.get('/history', authMiddleware, async (req, res, next) => {

  var memberId = req.decoded.memberId;
  var rsPinStock = await PinStockModel.find({ memberId });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsPinStock,
  });
});

/************************
function myPinStock()
************************/
router.get('/stock', authMiddleware, async (req, res, next) => {

  var sponsorId = req.decoded.memberId;
  var rsPin = await PinModel.find({ sponsorId, isActive: false });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsPin,
  });
});

module.exports = router;
