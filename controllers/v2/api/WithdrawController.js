var mongoose = require('mongoose');
var express = require('express-await');

var router = express.Router();

var MemberModel = mongoose.model('Member');
var Model = mongoose.model('Ewallet');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function get()
************************/
router.get('/', authMiddleware, async (req, res, next) => {

  // var data = req.query;

  var rs = [];
  var rs_ = await Model.aggregate([
    // $match: {
    //   date: {$lt: ISODate("2013-02-01T00:00:00.0Z")}
    // },
    { $group: {
      _id: '$memberId',
      description: { $push: '$$ROOT' },
      credit: { $sum: '$credit' },
      debit: { $sum: '$debit' },
    }},
  ]);

  var rsMember = await MemberModel.find({});

  var rs = rs_.map(row => {
    row.member = rsMember.reduce((rowCurrent, rowActive) => {

      if (rowActive.memberId == row._id) {
        return rowActive;
      }
      else {
        return rowCurrent;
      }
    }, {});
    return row;
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rs,
  });

});

function validate(req, res, next) {
  var data = req.body;
  var errors = {};
  console.log('LENGTH: ' + data.rsMember.length);
  if (data.rsMember.length <= 0)
    errors.rsMember = { message: 'Pilih satu member atau lebih, dahulu' };

    console.log('LENGTH: ' + data.rsMember.length);
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
  var date = Date.now();

  data.rsMember.forEach(row => {
    Model.create({
      memberId: row.memberId,
      date,
      credit: 0,
      debit: row.saldo,
      saldo: 0,
      description: 'Withdraw rutin',
    });
  });

  res.json({
    state: 'success',
    message: 'Withdraw berhasil',
    data,
  });
});

module.exports = router;
