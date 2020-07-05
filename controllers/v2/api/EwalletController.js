var mongoose = require('mongoose');
var slugify = require('slugify');
var currencyFormatter = require('currency-formatter');

var express = require('express-await');
var router = express.Router();

var EwalletModel = mongoose.model('Ewallet');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);
router.use(authMiddleware);

/************************
function get()
************************/
router.get('/', async (req, res, next) => {

  var memberId = req.decoded.memberId;
  var rsEwallet = await EwalletModel.find({ memberId }).sort('-date');

  var debit = 0;
  var credit = 0;
  var saldo = 0;

  rsEwallet.forEach(row => {
    debit += row.debit;
    credit += row.credit;
    saldo += (row.credit - row.debit);
  });

  var totalSaldo = saldo;

  rsEwallet = rsEwallet.map(row => {

    row.saldo = totalSaldo;
    row.saldo_ = currencyFormatter.format(row.saldo, { code: 'IDR' });
    totalSaldo -= (row.credit - row.debit);

    return row;
  });

  var debit_ = currencyFormatter.format(debit, { code: 'IDR' });
  var credit_ = currencyFormatter.format(credit, { code: 'IDR' });
  var saldo_ = currencyFormatter.format(saldo, { code: 'IDR' });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {
      total: {
        debit,
        credit,
        saldo,
        debit_,
        credit_,
        saldo_,
      },
      ewallets: rsEwallet,
    },
  });
});

module.exports = router;
