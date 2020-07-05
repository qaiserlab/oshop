var mongoose = require('mongoose');
var slugify = require('slugify');

var express = require('express-await');
var router = express.Router();

var MemberModel = mongoose.model('Member');
var MemberXpModel = mongoose.model('MemberXp');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);
router.use(authMiddleware);

/************************
function getTree()
************************/
router.get('/tree', async (req, res, next) => {

  // var data = req.query;
  //
  // if (data.id)
  //   var id = data.id;
  // else
    var id = req.decoded.id;

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

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: {
      memberXp: rowMemberXp,
      member: rowMember_,
    },
  });
});

/************************
function getReference()
************************/
router.get('/reference', async (req, res, next) => {

  var data = req.query;
  var memberId = req.decoded.memberId;

  var level = parseInt(data.level);
  if (level <= 0) level = 1;
  // console.log('member id: ' + memberId + ' level: ' + level);

  var rsMember = [];

  var rs = await MemberModel.find({ sponsorId: memberId }).populate('sponsor').fill('rsMensponsori');
  var ids = rs.map(row => row.memberId);
  rsMember.push(rs);

  for (var i = 2; i <= 10; i++) {
    var rs = await MemberModel.find({ sponsorId: { $in: ids } }).populate('sponsor').fill('rsMensponsori');
    var ids = rs.map(row => row.memberId);
    rsMember.push(rs);
  }

  // res.render('member/GenealogyReferenceView', {
  //   level,
  //   rsMember,
  // });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsMember,
  });
});

module.exports = router;
