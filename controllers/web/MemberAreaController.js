/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();
var pagination = require('pagination');

var currencyFormatter = require('currency-formatter');

/************************
function modelDefiner()
************************/

var SettingModel = mongoose.model('Setting');
var MemberModel = mongoose.model('Member');
var MemberPvModel = mongoose.model('MemberPv');
var MemberXpModel = mongoose.model('MemberXp');

var BankModel = mongoose.model('Bank');
var ProductModel = mongoose.model('Product');

var RegionalModel = mongoose.model('Regional');
var PaymentMethodModel = mongoose.model('PaymentMethod');

var EwalletModel = mongoose.model('Ewallet');
var StockModel = mongoose.model('Stock');

var BonusSponsorModel = mongoose.model('BonusSponsor');
var BonusDirectSellingModel = mongoose.model('BonusDirectSelling');
var BonusPersonalSpendingModel = mongoose.model('BonusPersonalSpending');
var BonusLeadershipModel = mongoose.model('BonusLeadership');
var BonusUnilevelModel = mongoose.model('BonusUnilevel');
var BonusPlatinumRangerModel = mongoose.model('BonusPlatinumRanger');
var BonusGlobalSharingModel = mongoose.model('BonusGlobalSharing');
var BonusPointRewardModel = mongoose.model('BonusPointReward');
var IncentivePerformanceModel = mongoose.model('IncentivePerformance');
var IncentiveFunctionalModel = mongoose.model('IncentiveFunctional');
var IncentiveHomeCarOwnershipModel = mongoose.model('IncentiveHomeCarOwnership');
var IncentiveTravelAboardModel = mongoose.model('IncentiveTravelAboard');
var SalaryModel = mongoose.model('Salary');

var PinModel = mongoose.model('Pin');
var PinStockModel = mongoose.model('PinStock');
var PinOrderModel = mongoose.model('PinOrder');

var OrderModel = mongoose.model('Order');
var StockiestOrderModel = mongoose.model('StockiestOrder');
var BonusPointModel = mongoose.model('BonusPoint');

/************************
function siteMiddleware()
************************/
var siteMiddleware = require('../middleware/siteMiddleware');
router.use(siteMiddleware);

/************************
function authMiddleware()
************************/
var authMiddleware = require('../middleware/authMiddleware');
router.getAsync('/:page', authMiddleware);

/************************
function renderProfile()
************************/
router.getAsync('/profile', async (req, res, next) => {
  var session = req.session;

  var rowMember = await MemberModel.findById(req.session.userId);
  var rowMemberXp = await MemberXpModel.findOne({ memberId: req.session.memberId });

  res.render('member/ProfileView', {
    session,
    rowMember,
    rowMemberXp,
  });
});

/************************
function renderUpdateProfile()
************************/
router.getAsync('/profile/update-profile', async (req, res, next) => {
  var rsRegional = await RegionalModel.find({});
  var rowMember = await MemberModel.findById(req.session.userId);

  res.render('member/UpdateProfileView', {
    rsRegional,
    rowMember,
  });
});

/************************
function renderUpdateBankAccount()
************************/
router.getAsync('/profile/update-bank-account', async (req, res, next) => {
  // var rsRegional = await RegionalModel.find({});
  var rsBank = await BankModel.getBankList();
  var rowMember = await MemberModel.findById(req.session.userId);

  res.render('member/UpdateBankAccountView', {
    // rsRegional,
    rsBank,
    rowMember,
  });
});

/************************
function renderChangePassword()
************************/
router.getAsync('/profile/change-password', async (req, res, next) => {
  var rowMember = await MemberModel.findById(req.session.userId);

  res.render('member/ChangePasswordView', {
    rowMember,
  });
});

/************************
function renderChangeStockiestPassword()
************************/
router.getAsync('/profile/change-stockiest-password', async (req, res, next) => {
  var rowMember = await MemberModel.findById(req.session.userId);

  res.render('member/ChangeStockiestPasswordView', {
    rowMember,
  });
});

/************************
function renderGenealogyTree()
************************/
router.getAsync('/genealogy-tree', async (req, res, next) => {

  var data = req.query;

  if (data.id)
    var id = data.id;
  else
    var id = req.session.userId;


  var rowMember = await MemberModel.findById(id)
    .populate('upline')
    .populate({
      path: 'leftFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    })
    .populate({
      path: 'middleFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    })
    .populate({
      path: 'rightFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    });
  // var rowMemberXp = await MemberXpModel.findOne({ memberId: req.session.memberId });
  var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });

  if (rowMember.leftFoot) {
    var leftFoot = rowMember.leftFoot;

    var leftFootCount = 1;
    if (leftFoot.leftFoot) leftFootCount++;
    if (leftFoot.middleFoot) leftFootCount++;
    if (leftFoot.rightFoot) leftFootCount++;

    leftFoot.count = leftFootCount;
  }
  else
    var leftFoot = { empty: true, count: 0 };

  if (rowMember.middleFoot) {
    var middleFoot = rowMember.middleFoot;

    var middleFootCount = 1;
    if (middleFoot.leftFoot) middleFootCount++;
    if (middleFoot.middleFoot) middleFootCount++;
    if (middleFoot.rightFoot) middleFootCount++;

    middleFoot.count = middleFootCount;
  }
  else
    var middleFoot = { empty: true, count: 0 };

  if (rowMember.rightFoot) {
    var rightFoot = rowMember.rightFoot;

    var rightFootCount = 1;
    if (rightFoot.leftFoot) rightFootCount++;
    if (rightFoot.middleFoot) rightFootCount++;
    if (rightFoot.rightFoot) rightFootCount++;

    rightFoot.count = rightFootCount;
  }
  else
    var rightFoot = { empty: true, count: 0 };

  var rowMember_ = {
    _id: rowMember._id,
    upline: rowMember.upline,
    memberId: rowMember.memberId,
    fullName: rowMember.fullName,


    totalLeft: rowMember.totalLeft,
    totalMiddle: rowMember.totalMiddle,
    totalRight: rowMember.totalRight,

    leftFoot,
    middleFoot,
    rightFoot,
  };

  res.render('member/GenealogyTreeView', {
    rowMemberXp,
    rowMember: rowMember_,
  });
});

/************************
function renderGenealogyReference()
************************/
router.getAsync('/genealogy-reference', async (req, res, next) => {
  var data = req.query;
  var memberId = req.session.memberId;

  if (!data.level)
    var level = 1;
  else
    var level = data.level;

  var rsMember = [];

  var rs = await MemberModel.find({ sponsorId: memberId }).populate('sponsor').fill('rsMensponsori');
  var ids = rs.map(row => row.memberId);
  rsMember.push(rs);

  for (var i = 2; i <= 10; i++) {
    var rs = await MemberModel.find({ sponsorId: { $in: ids } }).populate('sponsor').fill('rsMensponsori');
    var ids = rs.map(row => row.memberId);
    rsMember.push(rs);
  }

  res.render('member/GenealogyReferenceView', {
    level,
    rsMember,
  });
});

/************************
function renderBonusSponsor()
************************/
router.getAsync('/bonus-sponsor', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var rsBonusSponsor = await BonusSponsorModel.find({
    memberId: req.session.memberId,
  });

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  res.render('member/BonusSponsorView', {
    year,
    month,
    rsBonusSponsor,
  });
});

/************************
function renderBonusSponsorByMonth()
************************/
router.getAsync('/bonus-sponsor/:year/:month', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = req.params.year;
  var month = req.params.month;

  // var rsBonusSponsor = await BonusSponsorModel.findAllByMonth(req.session.memberId, year, month);
  var rsBonusSponsor = await BonusSponsorModel.find({
    memberId: req.session.memberId,
    date: {
      $gte: new Date(year, parseInt(month) - 1, 1),
      $lte: new Date(year, parseInt(month) - 1, 30),
    },
  });

  res.render('member/BonusSponsorView', {
    year,
    month,
    rsBonusSponsor,
  });
});

/************************
function renderFlashSale20()
************************/
router.getAsync('/flash-sale-20', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var rsBonusDirectSelling = await BonusDirectSellingModel.find({
    memberId: req.session.memberId,
  });

  res.render('member/FlashSale20View', {
    year: 2017,
    month: 10,
    rsBonusDirectSelling,
  });
});

/************************
function renderFlashSale20ByMonth()
************************/
router.getAsync('/flash-sale-20/:year/:month', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = req.params.year;
  var month = req.params.month;

  var rsBonusDirectSelling = await BonusDirectSellingModel.find({
    memberId: req.session.memberId,
    date: {
      $gte: new Date(year, parseInt(month) - 1, 1),
      $lte: new Date(year, parseInt(month) - 1, 30),
    },
  });

  res.render('member/FlashSale20View', {
    year,
    month,
    rsBonusDirectSelling,
  });
});

/************************
function renderIncentivePerformance()
************************/
router.getAsync('/performance-incentives', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

    
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsIncentivePerformance = await IncentivePerformanceModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PerformanceIncentivesView', {
    year,
    month,
    rsIncentivePerformance,
  });
});

/************************
function renderIncentivePerformanceByMonth()
************************/
router.getAsync('/performance-incentives/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsIncentivePerformance = await IncentivePerformanceModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PerformanceIncentivesView', {
    year,
    month,
    rsIncentivePerformance,
  });
});

/************************
function renderPersonalSpendingBonus()
************************/
router.getAsync('/personal-spending-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusPersonalSpending = await BonusPersonalSpendingModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/BonusPersonalSpendingView', {
    year,
    month,
    rsBonusPersonalSpending,
  });
});

/************************
function renderPersonalSpendingBonus()
************************/
router.getAsync('/personal-spending-bonus/:year/:month', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  // var rsBonusSponsor = await BonusSponsorModel.findAllByMonth(req.session.memberId, year, month);
  var rsBonusPersonalSpending = await BonusPersonalSpendingModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/BonusPersonalSpendingView', {
    year,
    month,
    rsBonusPersonalSpending,
  });
});

/************************
function renderLeadershipBonus()
************************/
router.getAsync('/leadership-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusLeadership = await BonusLeadershipModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/LeadershipBonusView', {
    year,
    month,
    rsBonusLeadership,
  });
});

/************************
function renderLeadershipBonus()
************************/
router.getAsync('/leadership-bonus/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsBonusLeadership = await BonusLeadershipModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/LeadershipBonusView', {
    year,
    month,
    rsBonusLeadership,
  });
});

/************************
function renderFunctionalIncentives()
************************/
router.getAsync('/functional-incentives', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsIncentiveFunctional = await IncentiveFunctionalModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/FunctionalIncentivesView', {
    year,
    month,
    rsIncentiveFunctional,
  });
});

/************************
function renderFunctionalIncentives()
************************/
router.getAsync('/functional-incentives/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsIncentiveFunctional = await IncentiveFunctionalModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/FunctionalIncentivesView', {
    year,
    month,
    rsIncentiveFunctional,
  });
});

/************************
function renderUnilevelBonus()
************************/
router.getAsync('/unilevel-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusUnilevel = await BonusUnilevelModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/UnilevelBonusView', {
    year,
    month,
    rsBonusUnilevel,
  });
});

/************************
function renderUnilevelBonus()
************************/
router.getAsync('/unilevel-bonus/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsBonusUnilevel = await BonusUnilevelModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/UnilevelBonusView', {
    year,
    month,
    rsBonusUnilevel,
  });
});

/************************
function renderHomeCarOwnershipIncentives()
************************/
router.getAsync('/home-car-ownership-incentives', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsIncentiveHomeCarOwnership = await IncentiveHomeCarOwnershipModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/HomeCarOwnershipIncentivesView', {
    year,
    month,
    rsIncentiveHomeCarOwnership,
  });
});

/************************
function renderHomeCarOwnershipIncentives()
************************/
router.getAsync('/home-car-ownership-incentives/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsIncentiveHomeCarOwnership = await IncentiveHomeCarOwnershipModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/HomeCarOwnershipIncentivesView', {
    year,
    month,
    rsIncentiveHomeCarOwnership,
  });
});

/************************
function renderTravelAboardIncentives()
************************/
router.getAsync('/travel-aboard-incentives', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsIncentiveTravelAboard = await IncentiveTravelAboardModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/TravelAboardIncentivesView', {
    year,
    month,
    rsIncentiveTravelAboard,
  });
});

/************************
function renderTravelAboardIncentives()
************************/
router.getAsync('/travel-aboard-incentives/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsIncentiveTravelAboard = await IncentiveTravelAboardModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/TravelAboardIncentivesView', {
    year,
    month,
    rsIncentiveTravelAboard,
  });
});

/************************
function renderPlatinumRangerBonus()
************************/
router.getAsync('/platinum-ranger-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusPlatinumRanger = await BonusPlatinumRangerModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PlatinumRangerBonusView', {
    year,
    month,
    rsBonusPlatinumRanger,
  });
});

/************************
function renderPlatinumRangerBonus()
************************/
router.getAsync('/platinum-ranger-bonus/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsBonusPlatinumRanger = await BonusPlatinumRangerModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PlatinumRangerBonusView', {
    year,
    month,
    rsBonusPlatinumRanger,
  });
});

/************************
function renderSalaryOnJob()
************************/
router.getAsync('/salary-on-job', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsSalary = await SalaryModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/SalaryOnJobView', {
    year,
    month,
    rsSalary,
  });
});

/************************
function renderSalaryOnJob()
************************/
router.getAsync('/salary-on-job/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsSalary = await SalaryModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/SalaryOnJobView', {
    year,
    month,
    rsSalary,
  });
});

/************************
function renderGlobalSharingBonus()
************************/
router.getAsync('/global-sharing-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusGlobalSharing = await BonusGlobalSharingModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/GlobalSharingBonusView', {
    year,
    month,
    rsBonusGlobalSharing,
  });
});

/************************
function renderGlobalSharingBonus()
************************/
router.getAsync('/global-sharing-bonus/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsBonusGlobalSharing = await BonusGlobalSharingModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/GlobalSharingBonusView', {
    year,
    month,
    rsBonusGlobalSharing,
  });
});

/************************
function renderPointRewardBonus()
************************/
router.getAsync('/point-reward-bonus', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  var rsBonusPointReward = await BonusPointRewardModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PointRewardBonusView', {
    year,
    month,
    rsBonusPointReward,
  });
});

/************************
function renderPointRewardBonus()
************************/
router.getAsync('/point-reward-bonus/:year', async (req, res, next) => {
  if (req.session.memberType != 'Premium')
    return res.redirect('/404');

  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month);

  var rsBonusPointReward = await BonusPointRewardModel.find({
    memberId: req.session.memberId,
    year,
  });

  res.render('member/PointRewardBonusView', {
    year,
    month,
    rsBonusPointReward,
  });
});

/************************
function renderRiwayatBelanja()
************************/
router.getAsync('/riwayat-belanja', async (req, res, next) => {

  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var memberId = req.session.memberId;

  var title = 'Riwayat Belanja';

  var rsOrder = [];
  var rsMemberOrder = await OrderModel.find({
    memberId,
    orderDate: {
      $gte: from,
      $lt: to,
    },
  });
  // var rsStockiestOrder = await StockiestOrderModel.find({
  //   memberId,
  //   orderDate: {
  //     $gte: from,
  //     $lt: to,
  //   },
  // });

  rsMemberOrder.forEach(row => {
    row.type = 'mo';
    rsOrder.push(row);
  });

  // rsStockiestOrder.forEach(row => {
  //   row.type = 'so';
  //   rsOrder.push(row);
  // });

  rsOrder.sort((pRow, cRow) => cRow.orderDate - pRow.orderDate);

  var personalPv = 0;
  var leftPv = 0;
  var middlePv = 0;
  var rightPv = 0;
  var totalPv = 0;

  var rowMemberXp = await MemberXpModel.findOne({ memberId: req.session.memberId });

  if (rowMemberXp) {
    personalPv = rowMemberXp.personalPv;
    leftPv = rowMemberXp.leftPv;
    middlePv = rowMemberXp.middlePv;
    rightPv = rowMemberXp.rightPv;
    totalPv = rowMemberXp.totalPv;
  }

  res.render('member/RiwayatBelanjaView', {
    title,
    from_,
    to_,
    rsOrder,
    rowMemberXp,
    personalPv,
    leftPv,
    middlePv,
    rightPv,
    totalPv,
  });
});

/************************
function renderRiwayatBelanjaInvoiceMO()
************************/
router.getAsync('/riwayat-belanja/mo/:code', async (req, res, next) => {
  var code = req.params.code;
  var rowOrder = await OrderModel.findOne({ code }).populate('stockiest');

  res.render('member/RiwayatBelanjaInvoiceView', {
    rowOrder,
  });
});

/************************
function renderRiwayatBelanjaInvoiceSO()
************************/
router.getAsync('/riwayat-belanja/so/:code', async (req, res, next) => {
  var code = req.params.code;
  var rowOrder = await StockiestOrderModel.findOne({ code }).populate('member');

  res.render('member/RiwayatBelanjaInvoiceView', {
    rowOrder,
  });
});

/************************
function renderEwallet()
************************/
router.getAsync('/ewallet', async (req, res, next) => {

  var memberId = req.session.memberId;
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

  res.render('member/EwalletView', {
    debit,
    credit,
    saldo,
    debit_,
    credit_,
    saldo_,
    rsEwallet,
  });
});

/************************
function renderStock()
************************/
router.getAsync('/stock', async (req, res, next) => {

  var memberId = req.session.memberId;
  // var rsStock = await StockModel.find({ memberId }).populate('product');

  var rsStock = await StockModel.aggregate({
    $group: {
      _id: '$product.productName',
      totalIn: { $sum: '$in' },
      totalOut: { $sum: '$out' },
    },
  });

  res.json(rsStock);
  // res.render('member/StockCardView', {
  //   rsStock,
  // });
});

/************************
function renderStockCard()
************************/
router.getAsync('/stock-card', async (req, res, next) => {

  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var memberId = req.session.memberId;
  var rsStockBefore = await StockModel.find({
    memberId,
    date: {
      $lt: from,
    },
  }).populate('product');
  var rsStock = await StockModel.find({
    memberId,
    date: {
      $gte: from,
      $lt: to,
    },
  }, [], {
    sort: { date: 1 },
  }).populate('product');

  var rsStock_ = rsStock.reduce((rs, row) => {
    var found = false;

    if (rs[row.product.productId + row.color + row.size])
      found = rs[row.product.productId + row.color + row.size].rs.some(row_ =>
        row_.product.productId == row.product.productId &&
        row_.color == row.color &&
        row_.size == row.size
      );

    if (!found) {

      var balance = rsStockBefore.reduce((total, rowStockBefore) => {
        if (rowStockBefore.productId == row.product.productId &&
        rowStockBefore.color == row.color &&
        rowStockBefore.size == row.size)
          total += rowStockBefore.in - rowStockBefore.out;

        return total;
      }, 0);

      rs[row.product.productId + row.color + row.size] = {
        productId: row.product.productId,
        productName: row.product.productName,
        color: row.color,
        size: row.size,
        rs: [],
        balance,
      };
    }

    rs[row.product.productId + row.color + row.size].rs.push(row);

    return rs;
  }, {});

  // res.json(rsStock_);
  res.render('member/StockCardView', {
    rsStock: rsStock_,
    // rsStock,
    from_,
    to_,
  });
});

/************************
function renderStockOrder()
************************/
router.getAsync('/stock-order', async (req, res, next) => {
  res.render('member/StockOrderView');
});

/************************
function renderPinStockCard()
************************/
router.getAsync('/pin-stock-card', async (req, res, next) => {

  var memberId = req.session.memberId;
  var rsPinStock = await PinStockModel.find({ memberId });

  res.render('member/PinStockCardView', {
    rsPinStock,
  });
});

/************************
function renderPinStock()
************************/
router.getAsync('/pin-stock', async (req, res, next) => {
  var sponsorId = req.session.memberId;
  var rsPin = await PinModel.find({ sponsorId, isActive: false });

  res.render('member/PinStockView', {
    rsPin,
  });
});

/************************
function renderMemberPending()
************************/
router.getAsync('/pending', async (req, res, next) => {
  var sponsorId = req.session.memberId;
  var rsMember = await MemberModel.find({ sponsorId, activation: 'Pending' }, [], {
    sort: { registeredOn: -1 },
  });

  res.render('member/MemberPendingView', {
    rsMember,
  });
});

/************************
function renderMemberReview()
************************/
router.getAsync('/review', async (req, res, next) => {
  var id = req.query.id;

  var rowMember = await MemberModel.findById(id);
  var sponsorId = rowMember.sponsorId;

  var rowSponsor = await MemberModel.findOne({ memberId: sponsorId });
  var rsPin = await PinModel.find({ sponsorId, isActive: false });
  var rsUpline = await MemberModel.find({ sponsorId, activation: 'Active' });

  res.render('member/MemberReviewView', {
    rowMember,
    rowSponsor,
    rsPin,
    rsUpline,
  });
});

/************************
function renderRegister()
************************/
router.getAsync('/register', async (req, res, next) => {

  var pinId = req.query.id;
  var sponsorId = req.session.memberId;

  var rowSponsor = await MemberModel.findOne({ memberId: sponsorId });

  var rsPin = await PinModel.find({ sponsorId, isActive: false });
  var rowPin = await PinModel.findById(pinId);

  var rsUpline = [];
  var rsNextUpline = [];

  var rowMember = await MemberModel.findOne({ memberId: req.session.memberId })
    .populate({
      path: 'leftFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    })
    .populate({
      path: 'middleFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    })
    .populate({
      path: 'rightFoot',
      populate: [
        { path: 'leftFoot' },
        { path: 'middleFoot' },
        { path: 'rightFoot' }
      ],
    });

  if (rowMember.leftFoot) rsUpline.push(rowMember.leftFoot);
  if (rowMember.middleFoot) rsUpline.push(rowMember.middleFoot);
  if (rowMember.rightFoot) rsUpline.push(rowMember.rightFoot);

  if (rowMember.leftFoot) rsNextUpline.push(rowMember.leftFoot);
  if (rowMember.middleFoot) rsNextUpline.push(rowMember.middleFoot);
  if (rowMember.rightFoot) rsNextUpline.push(rowMember.rightFoot);

  var i = 0;
  var rsTmpUpline = [];

  while (rsNextUpline.length > 0) {
    i++;
    if (i > 1) rsNextUpline = rsTmpUpline;
    rsTmpUpline = [];

    for (let nextUpline of rsNextUpline) {

      rowMember = await MemberModel.findOne({ memberId: nextUpline.memberId })
        .populate({
          path: 'leftFoot',
          populate: [
            { path: 'leftFoot' },
            { path: 'middleFoot' },
            { path: 'rightFoot' }
          ],
        })
        .populate({
          path: 'middleFoot',
          populate: [
            { path: 'leftFoot' },
            { path: 'middleFoot' },
            { path: 'rightFoot' }
          ],
        })
        .populate({
          path: 'rightFoot',
          populate: [
            { path: 'leftFoot' },
            { path: 'middleFoot' },
            { path: 'rightFoot' }
          ],
        });

      if (rowMember.leftFoot) rsUpline.push(rowMember.leftFoot);
      if (rowMember.middleFoot) rsUpline.push(rowMember.middleFoot);
      if (rowMember.rightFoot) rsUpline.push(rowMember.rightFoot);

      // rsNextUpline = [];
      if (rowMember.leftFoot) rsTmpUpline.push(rowMember.leftFoot);
      if (rowMember.middleFoot) rsTmpUpline.push(rowMember.middleFoot);
      if (rowMember.rightFoot) rsTmpUpline.push(rowMember.rightFoot);

    }
  }

  var rsBank = await BankModel.getBankList();
  var rsPaymentMethod = await PaymentMethodModel.find();

  res.render('member/RegisterView', {
    rowSponsor,
    rsPin,
    rowPin,
    rsUpline,
    rsBank,
    rsPaymentMethod,
  });
});

/************************
function renderInvoice()
************************/
router.getAsync('/invoice/:code', async (req, res, next) => {
  var code = req.params.code;
  var rowOrder = await OrderModel.findOne({ code });

  res.render('member/InvoiceView', {
    rowOrder,
  });
});

/************************
function renderStockOrder()
************************/
router.getAsync('/member-order', async (req, res, next) => {
  res.render('member/MemberOrderView');
});

/************************
function renderNewOrder()
************************/
router.getAsync('/new-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Baru';

  var rsOrder_ = await OrderModel.find({
    stockiestId,
    status: 'Pending'
  });

  var rsOrder = rsOrder_.filter(row => {
    return Date.now() < row.dueDate;
  });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderConfirmedOrder()
************************/
router.getAsync('/confirmed-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Dikonfirmasi';

  var rsOrder = await OrderModel.find({ stockiestId, status: 'Confirmed' });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderPaidOrder()
************************/
router.getAsync('/paid-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Dibayar';

  var rsOrder = await OrderModel.find({ stockiestId, status: 'Paid' });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderProcessedOrder()
************************/
router.getAsync('/processed-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Diproses';

  var rsOrder = await OrderModel.find({ stockiestId, status: 'Processed' });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderDeliveredOrder()
************************/
router.getAsync('/delivered-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Delivered';

  var rsOrder = await OrderModel.find({ stockiestId, status: 'Delivered' });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderExpiredOrder()
************************/
router.getAsync('/expired-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'Order Expire';

  var rsOrder_ = await OrderModel.find({
    stockiestId,
    status: 'Pending'
  });

  var rsOrder = rsOrder_.filter(row => {
    return Date.now() >= row.dueDate;
  });

  res.render('member/OrderView', {
    title,
    rsOrder,
  });
});

/************************
function renderPinInvoice()
************************/
router.getAsync('/pin-invoice/:code', async (req, res, next) => {
  var code = req.params.code;
  var rowPinOrder = await PinOrderModel.findOne({ code }).populate('member');

  res.render('member/PinInvoiceView', {
    rowPinOrder,
  });
});

/************************
function renderNewPinOrder()
************************/
router.getAsync('/new-pin-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'PIN Order Baru';

  var rsPinOrder_ = await PinOrderModel.find({
    stockiestId,
    status: 'Pending'
  }).populate('member');

  var rsPinOrder = rsPinOrder_.filter(row => {
    return Date.now() < row.dueDate;
  });

  res.render('member/PinOrderView', {
    title,
    rsPinOrder,
  });
});

/************************
function renderApprovedPinOrder()
************************/
router.getAsync('/approved-pin-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'PIN Order Approved';

  var rsPinOrder = await PinOrderModel.find({
    stockiestId,
    status: 'Approved'
  }).populate('member');

  res.render('member/PinOrderView', {
    title,
    rsPinOrder,
  });
});

/************************
function renderExpiredPinOrder()
************************/
router.getAsync('/expired-pin-order', async (req, res, next) => {
  var stockiestId = req.session.memberId;
  var title = 'PIN Order Expire';

  var rsPinOrder_ = await PinOrderModel.find({
    stockiestId,
    status: 'Pending'
  }).populate('member');

  var rsPinOrder = rsPinOrder_.filter(row => {
    return Date.now() >= row.dueDate;
  });

  res.render('member/PinOrderView', {
    title,
    rsPinOrder,
  });
});

/************************
function renderLaporanPenjualanProduk()
************************/
router.getAsync('/laporan-penjualan-produk', async (req, res, next) => {
  var title = 'Laporan Penjualan Produk';

  if (req.query.fromDate && req.query.toDate) {
    var xFromDate = req.query.fromDate.split('-');
    var xToDate = req.query.toDate.split('-');

    var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
    var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  }
  else {
    var dFromDate = new Date();
    var dToDate = new Date();
  }

  var fromDate = dFromDate.getFullYear() + '-' + (dFromDate.getMonth() + 1) + '-' + dFromDate.getDate();
  var toDate = dToDate.getFullYear() + '-' + (dToDate.getMonth() + 1) + '-' + dToDate.getDate();

  var rsOrder = await OrderModel.find({
    stockiestId: req.session.memberId,
    orderDate: {
      $gte: dFromDate,
      $lte: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];

  rsCart.forEach(row => {

    var found = false;
    var foundIndex = -1;
    var i = -1;

    rsProductSales.forEach(row_ => {
      i++;

      if (row.skuNumber == row_.skuNumber &&
        row.size == row_.size &&
        row.color == row_.color) {
        found = true;
        foundIndex = i;
      }

    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.render('member/LaporanPenjualanProdukView', {
    title,
    fromDate,
    toDate,
    rsProductSales,
    total,
  });
});

/************************
function renderLaporanPenjualanProdukDetail()
************************/
router.getAsync('/laporan-penjualan-produk/:skuNumber', async (req, res, next) => {
  var title = 'Laporan Penjualan Produk';

  var skuNumber = req.params.skuNumber;
  var rowProduct = await ProductModel.findOne({ skuNumber });

  if (req.query.fromDate && req.query.toDate) {
    var xFromDate = req.query.fromDate.split('-');
    var xToDate = req.query.toDate.split('-');

    var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
    var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  }
  else {
    var dFromDate = new Date();
    var dToDate = new Date();
  }

  var fromDate = dFromDate.getFullYear() + '-' + (dFromDate.getMonth() + 1) + '-' + dFromDate.getDate();
  var toDate = dToDate.getFullYear() + '-' + (dToDate.getMonth() + 1) + '-' + dToDate.getDate();

  var rsOrder = await OrderModel.find({
    stockiestId: req.session.memberId,
    orderDate: {
      $gte: dFromDate,
      $lte: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {

      rsCart.push({
        orderDate: row.orderDate,
        orderDate_: row.orderDate_,
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var total = 0;
  var rsProductSales = rsCart.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.render('member/LaporanPenjualanProdukDetailView', {
    title,
    fromDate,
    toDate,
    rowProduct,
    rsProductSales,
    total,
  });
});

/************************
function renderOrderStockiest()
************************/
router.getAsync('/order-stockiest', async (req, res, next) => {
  var title = 'Order Stokist';

  res.render('member/OrderStockiestView', {
    title,
  });
});

/************************
function renderOrderPIN()
************************/
router.getAsync('/order-pin', async (req, res, next) => {
  var title = 'Order PIN';
  var rowSetting = await SettingModel.findOne({ settingId: 1 });

  res.render('member/OrderPINView', {
    title,
    rowSetting,
  });
});

/************************
function renderStockiestProduct()
************************/
router.getAsync('/stockiest-product', async (req, res, next) => {
  var title = 'Produk Stokist';
  var stockiestId = req.query.stockiestId;
  var rsProduct = [];

  if (stockiestId) {

    var rsStock = await StockModel.find({
      memberId: stockiestId,
    }).populate('product');

    rsStock.forEach(row => {

      foundIndex = -1; i = -1;

      found = rsProduct.some(row_ => {
        i++;
        if (row.product.productId == row_.product.productId &&
        row.color == row_.color &&
        row.size == row_.size) {
          foundIndex = i;
          return true;
        }
        else
          return false;
      });

      if (!row.product.productId)
        row.product_ = row.product.productName;
      else
        row.product_ = row.product.productId + '/' + row.product.productName;

      if (found) {
        rsProduct[foundIndex].in += row.in;
        rsProduct[foundIndex].out += row.out;
      }
      else {
        rsProduct.push(row);
      }

    });

    rsProduct.map(row => {
      row.balance = row.in - row.out;
      return row;
    });

    rsProduct.sort((r1, r2) => {
      return r2.balance - r1.balance;
    });

  }

  res.render('member/StockiestProductView', {
    title,
    stockiestId,
    rsProduct,
  });
});

/************************
function renderTotalStock()
************************/
router.getAsync('/total-stock', async (req, res, next) => {
  var title = 'Total Stok';
  var stockiestId = req.session.memberId;
  var rsProduct = [];

  if (stockiestId) {

    var rsStock = await StockModel.find({
      memberId: stockiestId,
    }).populate('product');

    rsStock.forEach(row => {

      foundIndex = -1; i = -1;

      found = rsProduct.some(row_ => {
        i++;
        if (row.product.productId == row_.product.productId &&
        row.color == row_.color &&
        row.size == row_.size) {
          foundIndex = i;
          return true;
        }
        else
          return false;
      });

      if (!row.product.productId)
        row.product_ = row.product.productName;
      else
        row.product_ = row.product.productId + '/' + row.product.productName;

      if (found) {
        rsProduct[foundIndex].in += row.in;
        rsProduct[foundIndex].out += row.out;
      }
      else {
        rsProduct.push(row);
      }

    });

    rsProduct.map(row => {
      row.balance = row.in - row.out;
      return row;
    });

    rsProduct.sort((r1, r2) => {
      return r2.balance - r1.balance;
    });

  }

  res.render('member/TotalStockView', {
    title,
    stockiestId,
    rsProduct,
  });
});

/************************
function renderLaporanPenjualan()
************************/
router.getAsync('/laporan-penjualan', async (req, res, next) => {
  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var rsOrder = await OrderModel.find({
    stockiestId: req.session.memberId,
    orderDate: {
      $gte: from,
      $lt: to,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        skuNumber: rowCart.skuNumber,
        productId: rowCart.productId,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];

  rsCart.forEach(row => {

    var found = false;
    var foundIndex = -1;
    var i = -1;

    rsProductSales.forEach(row_ => {
      i++;

      if (row.skuNumber == row_.skuNumber &&
        row.size == row_.size &&
        row.color == row_.color) {
        found = true;
        foundIndex = i;
      }

    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.render('member/LaporanPenjualanView', {
    from_,
    to_,
    rsProductSales,
    total,
  });
});

/************************
function renderLaporanPembelian()
************************/
router.getAsync('/laporan-pembelian', async (req, res, next) => {
  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var rsOrder = await StockiestOrderModel.find({
    memberId: req.session.memberId,
    orderDate: {
      $gte: from,
      $lt: to,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        skuNumber: rowCart.skuNumber,
        productId: rowCart.productId,
        productName: rowCart.productName,
        size: rowCart.size,
        color: rowCart.color,
        price: rowCart.price,
        price_: currencyFormatter.format(rowCart.price, { code: 'IDR' }),
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];

  rsCart.forEach(row => {

    var found = false;
    var foundIndex = -1;
    var i = -1;

    rsProductSales.forEach(row_ => {
      i++;

      if (row.skuNumber == row_.skuNumber &&
        row.size == row_.size &&
        row.color == row_.color) {
        found = true;
        foundIndex = i;
      }

    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.render('member/LaporanPembelianView', {
    from: from_,
    to: to_,
    rsProductSales,
    total,
  });
});

/************************
function renderLaporanBestSeller()
************************/
router.getAsync('/laporan-best-seller', async (req, res, next) => {
  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var stockiestId = req.session.memberId;
  var rsOrder = await OrderModel.find({
    stockiestId,
    orderDate: {
      $gte: from,
      $lt: to,
    },
  });

  var rsCart = [];
  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        skuNumber: rowCart.skuNumber,
        productId: rowCart.productId,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];

  rsCart.forEach(row => {

    var found = false;
    var foundIndex = -1;
    var i = -1;

    rsProductSales.forEach(row_ => {
      i++;

      if (row.skuNumber == row_.skuNumber &&
        row.size == row_.size &&
        row.color == row_.color) {
        found = true;
        foundIndex = i;
      }

    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  rsProductSales.sort((current, row) => {
    return row.qty - current.qty;
  });

  var i = 0;
  rsProductSales.map(row => {

    i++;
    switch (i) {
      case 1:
        var rank = i + 'ST';
        break;
      case 2:
        var rank = i + 'ND';
        break;
      case 3:
        var rank = i + 'RD';
        break;
      default:
        var rank = i + 'TH';
    }
    row.rank = rank;

    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    // total += row.subTotal;

    return row;
  });

  res.render('member/LaporanBestSellerView', {
    from_,
    to_,
    rsProductSales,
  });
});

module.exports = router;
