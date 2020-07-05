var mongoose = require('mongoose');
var slugify = require('slugify');

var express = require('express-await');
var router = express.Router();

var OrderModel = mongoose.model('Order');
var MemberXpModel = mongoose.model('MemberXp');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);
router.use(authMiddleware);

/************************
function get()
************************/
router.get('/', async (req, res, next) => {

  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var memberId = req.decoded.memberId;

  var rsOrder = [];
  var rsMemberOrder = await OrderModel.find({
    memberId,
    orderDate: {
      $gte: from,
      $lt: to,
    },
  });

  rsMemberOrder.forEach(row => {
    row.type = 'mo';
    rsOrder.push(row);
  });

  rsOrder.sort((pRow, cRow) => cRow.orderDate - pRow.orderDate);

  var personalPv = 0;
  var leftPv = 0;
  var middlePv = 0;
  var rightPv = 0;
  var totalPv = 0;

  var rowMemberXp = await MemberXpModel.findOne({ memberId: req.decoded.memberId });

  if (rowMemberXp) {
    personalPv = rowMemberXp.personalPv;
    leftPv = rowMemberXp.leftPv;
    middlePv = rowMemberXp.middlePv;
    rightPv = rowMemberXp.rightPv;
    totalPv = rowMemberXp.totalPv;
  }

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {
      total: {
        personalPv,
        leftPv,
        middlePv,
        rightPv,
        totalPv,
      },
      memberXp: rowMemberXp,
      orders: rsOrder,
    },
  });
});

module.exports = router;
