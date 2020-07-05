var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var encrypt = require('../../helpers/encrypt');

var Model = mongoose.model('PinOrder');
var MemberModel = mongoose.model('Member');
var PinModel = mongoose.model('Pin');
var PinStockModel = mongoose.model('PinStock');

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

async function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.stockiestId)
    errors.stockiestId = { message: 'ID Stokist belum diisi' };
  else {
    var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });
    if (!rowStockiest) {
      errors.stockiestId = { message: 'Stokist dengan ID ' + data.stockiestId + ' tidak ditemukan'};
    }
  }

  if (!data.qty)
    errors.qty = { message: 'Qty belum diisi' };
  else {
    if (parseInt(data.qty) <= 0)
      errors.qty = { message: 'Qty tidak boleh kosong' };
  }

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

  var code = encrypt.shortid();

  var memberId = req.session.memberId;
  var rowMember = await MemberModel.findOne({ memberId: memberId });
  var member = rowMember._id;

  var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });
  var stockiest = rowStockiest._id;

  var orderDate = Date.now();
  var dueDate = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Pending';

  data.code = code;
  data.memberId = memberId;
  data.member = member;

  data.stockiest = stockiest;

  data.orderDate = orderDate;
  data.dueDate = dueDate;
  data.status = status;

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

async function validateApprove(req, res, next) {
  var errors = {};

  var rowPinOrder = await Model.findOne({ code: req.params.code });
  var qty = rowPinOrder.qty;

  var rsStock = await PinStockModel.aggregate([
    { $match: { memberId: req.session.memberId }},
    { $group: {
      _id: '$memberId',
      totalIn: { $sum: '$in' },
      totalOut: { $sum: '$out' },
    }},
  ]);

  if (rsStock)
    var totalStock = rsStock[0].totalIn - rsStock[0].totalOut;
  else
    var totalStock = 0;

  if (qty > totalStock)
    errors.qty = { message: 'Stok PIN tidak mencukupi' };

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
function approve()
************************/
router.put('/approve/:code', validateApprove, async (req, res, next) => {
  var code = req.params.code;
  var data = req.body;
  var status = 'Approved';

  var rowPinOrder = await Model.findOneAndUpdate({ code }, { status });
  // var rowPinOrder = await Model.findOne({ code });
  var qty = rowPinOrder.qty;

  var rsPin = await PinModel.find({ sponsorId: rowPinOrder.stockiestId, isActive: false });

  for (var i = 1; i <= qty; i++) {
    var rowPin = rsPin[i - 1];
    rowPin.sponsorId = rowPinOrder.memberId;
    await rowPin.save();
  }

  var date = Date.now();
  var description = 'Penjualan PIN ke Member ' + rowPinOrder.memberId;

  PinStockModel.create({
    memberId: rowPinOrder.stockiestId,
    date,
    description,
    in: 0,
    out: rowPinOrder.qty,
  });

  var description = 'Pembelian PIN ke Stokist ' + rowPinOrder.stockiestId;

  PinStockModel.create({
    memberId: rowPinOrder.memberId,
    date,
    description,
    in: rowPinOrder.qty,
    out: 0,
  });

  res.json({
    state: 'success',
    message: 'Change state success',
    data: rowPinOrder,
  });
});


module.exports = router;
