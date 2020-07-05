/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var BonusSponsorModel = mongoose.model('BonusSponsor');
var BonusDirectSellingModel = mongoose.model('BonusDirectSelling');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);
router.use(authMiddleware);

/************************
function networkGrowthIncentives()
************************/
router.get('/network-growth-incentives', async (req, res, next) => {

  var year = req.query.year;
  var month = req.query.month;

  var rsBonusSponsor = await BonusSponsorModel.find({
    memberId: req.decoded.memberId,
    date: {
      $gte: new Date(year, parseInt(month) - 1, 1),
      $lte: new Date(year, parseInt(month) - 1, 30),
    },
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsBonusSponsor,
  });
});

/************************
function directSellingIncentives()
************************/
router.get('/direct-selling-incentives', async (req, res, next) => {

  var year = req.query.year;
  var month = req.query.month;

  var rsBonusDirectSelling = await BonusDirectSellingModel.find({
    memberId: req.decoded.memberId,
    date: {
      $gte: new Date(year, parseInt(month) - 1, 1),
      $lte: new Date(year, parseInt(month) - 1, 30),
    },
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsBonusDirectSelling,
  });
});

/************************
function achievementIncentives()
************************/
router.get('/achievement-incentives', (req, res, next) => {

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {},
  });
});

/************************
function leadershipIncentives()
************************/
router.get('/leadership-incentives', (req, res, next) => {

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {},
  });
});

/************************
function brotherhoodCare()
************************/
router.get('/brotherhood-care', (req, res, next) => {

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {},
  });
});

/************************
function profitSharingIncentives()
************************/
router.get('/profit-sharing-incentives', (req, res, next) => {

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {},
  });
});

module.exports = router;
