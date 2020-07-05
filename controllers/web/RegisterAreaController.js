/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

/************************
function modelDefiner()
************************/

var MemberModel = mongoose.model('Member');
var BankModel = mongoose.model('Bank');
var PaymentMethodModel = mongoose.model('PaymentMethod');

/************************
function siteMiddleware()
************************/
var siteMiddleware = require('../middleware/siteMiddleware');
router.use(siteMiddleware);

/************************
function renderRegister()
************************/
router.getAsync('/', async (req, res, next) => {
  res.render('register/RegisterView');
});

/************************
function renderPremium()
************************/
router.getAsync('/premium', async (req, res, next) => {
  var rsPaymentMethod = await PaymentMethodModel.find();
  var rsBank = await BankModel.getBankList();

  res.render('register/RegisterPremiumView', {
    rsPaymentMethod,
    rsBank,
  });
});

module.exports = router;
