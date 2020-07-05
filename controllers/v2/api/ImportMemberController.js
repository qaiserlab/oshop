var mongoose = require('mongoose');
var xlsx = require('node-xlsx');

var express = require('express-await');
var router = express.Router();

var Model = mongoose.model('Member');
var MemberXpModel = mongoose.model('MemberXp');

var encrypt = require('../../../helpers/encrypt');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.file)
    errors.file = { message: 'File belum diisi' };

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
// router.post('/', validate, async (req, res, next) => {
//   var data = req.body;
//
//   file = xlsx.parse(`./public/writable/tmp/${data.file}`)[0].data;
//
//   for (var i = 1;i < file.length; i++) {
//     var memberId = file[i][0];
//     var fullName = file[i][1];
//     var firstName = fullName.split(' ').slice(0, -1).join(' ');
//     var lastName = fullName.split(' ').slice(-1).join(' ');
//     var uplineId = file[i][2];
//     var position = file[i][3];
//     var sponsorId = file[i][4];
//
//     var memberType = 'Premium';
//     var activation = 'Active';
//     var salt = encrypt.cryptPassword(encrypt.uniqid());
//
//     var password_ = '12345';
//     var password = encrypt.cryptPassword(password_ + salt);
//     var registeredOn = Date.now();
//
//     var data_ = {
//       memberId,
//       fullName,
//       firstName,
//       lastName,
//
//       memberType,
//       activation,
//       salt,
//       password,
//       stockiestSalt: salt,
//       stockiestPassword: password,
//       registeredOn,
//     };
//
//     var rowUpline = await Model.findOne({ memberId: uplineId });
//     var rowSponsor = await Model.findOne({ memberId: sponsorId });
//
//     if (rowUpline) {
//       data_.uplineId = uplineId;
//       data_.upline = rowUpline._id;
//     }
//
//     if (rowSponsor) {
//       data_.sponsorId = sponsorId;
//       data_.sponsor = rowSponsor._id;
//     }
//
//     await Model.create(data_);
//     MemberXpModel.create({
//       memberId,
//       personalPv: 0,
//       leftPv: 0,
//       middlePv: 0,
//       rightPv: 0,
//       rangerUp: false,
//       platinumRangerUp: false,
//       ranger: {
//         left: 0,
//         middle: 0,
//         right: 0,
//       },
//       platinumRanger: {
//         left: 0,
//         middle: 0,
//         right: 0,
//       },
//     });
//
//     if (rowUpline) {
//       var rowMember = await Model.findOne({ memberId });
//       switch (position) {
//         // left
//         case 0:
//           rowUpline.leftFootId = memberId;
//           rowUpline.leftFoot = rowMember._id;
//           rowUpline.save();
//           break;
//
//         // middle
//         case 1:
//           rowUpline.middleFootId = memberId;
//           rowUpline.middleFoot = rowMember._id;
//           rowUpline.save();
//           break;
//
//         // right
//         case 2:
//           rowUpline.rightFootId = memberId;
//           rowUpline.rightFoot = rowMember._id;
//           rowUpline.save();
//       }
//
//       var lastMemberId = memberId;
//
//       while(rowUpline) {
//         if (rowUpline.leftFootId == lastMemberId) {
//           var totalLeft = rowUpline.totalLeft || 0;
//           totalLeft++;
//           rowUpline.set({ totalLeft });
//           rowUpline.save();
//         }
//
//         if (rowUpline.middleFootId == lastMemberId) {
//           var totalMiddle = rowUpline.totalMiddle || 0;
//           totalMiddle++;
//           rowUpline.set({ totalMiddle });
//           rowUpline.save();
//         }
//
//         if (rowUpline.rightFootId == lastMemberId) {
//           var totalRight = rowUpline.totalRight || 0;
//           totalRight++;
//           rowUpline.set({ totalRight });
//           rowUpline.save();
//         }
//
//         lastMemberId = rowUpline.memberId;
//         rowUpline = await Model.findOne({ memberId: rowUpline.uplineId });
//       }
//
//     }
//
//   }
//
//   res.json({
//     state: 'success',
//     message: 'Import Member berhasil',
//     data: data_,
//   });
//
// });

// /************************
// function post()
// ************************/
// router.post('/', validate, async (req, res, next) => {
//   var data = req.body;
//
//   file = xlsx.parse(`./public/writable/tmp/${data.file}`)[0].data;
//
//   for (var i = 1;i < file.length; i++) {
//     var memberId = file[i][0];
//     var fullName = file[i][1];
//     var firstName = fullName.split(' ').slice(0, -1).join(' ');
//     var lastName = fullName.split(' ').slice(-1).join(' ');
//     var email = file[i][2];
//     var phoneNumber = file[i][3];
//     var address = file[i][4];
//     var uplineId = file[i][5];
//     var position = file[i][6];
//     var sponsorId = file[i][7];
//
//     var memberType = 'Premium';
//     var activation = 'Active';
//     var salt = encrypt.cryptPassword(encrypt.uniqid());
//
//     var password_ = '12345';
//     var password = encrypt.cryptPassword(password_ + salt);
//     var registeredOn = Date.now();
//
//     var data_ = {
//       memberId,
//       fullName,
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       address,
//
//       memberType,
//       activation,
//       salt,
//       password,
//       stockiestSalt: salt,
//       stockiestPassword: password,
//       registeredOn,
//     };
//
//     var rowUpline = await Model.findOne({ memberId: uplineId });
//     var rowSponsor = await Model.findOne({ memberId: sponsorId });
//
//     if (rowUpline) {
//       data_.uplineId = uplineId;
//       data_.upline = rowUpline._id;
//     }
//
//     if (rowSponsor) {
//       data_.sponsorId = sponsorId;
//       data_.sponsor = rowSponsor._id;
//     }
//
//     await Model.create(data_);
//     MemberXpModel.create({
//       memberId,
//       personalPv: 0,
//       leftPv: 0,
//       middlePv: 0,
//       rightPv: 0,
//       rangerUp: false,
//       platinumRangerUp: false,
//       ranger: {
//         left: 0,
//         middle: 0,
//         right: 0,
//       },
//       platinumRanger: {
//         left: 0,
//         middle: 0,
//         right: 0,
//       },
//     });
//
//     if (rowUpline) {
//       var rowMember = await Model.findOne({ memberId });
//       switch (position) {
//         // left
//         case 0:
//           rowUpline.leftFootId = memberId;
//           rowUpline.leftFoot = rowMember._id;
//           rowUpline.save();
//           break;
//
//         // middle
//         case 1:
//           rowUpline.middleFootId = memberId;
//           rowUpline.middleFoot = rowMember._id;
//           rowUpline.save();
//           break;
//
//         // right
//         case 2:
//           rowUpline.rightFootId = memberId;
//           rowUpline.rightFoot = rowMember._id;
//           rowUpline.save();
//       }
//
//       var lastMemberId = memberId;
//
//       while(rowUpline) {
//         if (rowUpline.leftFootId == lastMemberId) {
//           var totalLeft = rowUpline.totalLeft || 0;
//           totalLeft++;
//           rowUpline.set({ totalLeft });
//           rowUpline.save();
//         }
//
//         if (rowUpline.middleFootId == lastMemberId) {
//           var totalMiddle = rowUpline.totalMiddle || 0;
//           totalMiddle++;
//           rowUpline.set({ totalMiddle });
//           rowUpline.save();
//         }
//
//         if (rowUpline.rightFootId == lastMemberId) {
//           var totalRight = rowUpline.totalRight || 0;
//           totalRight++;
//           rowUpline.set({ totalRight });
//           rowUpline.save();
//         }
//
//         lastMemberId = rowUpline.memberId;
//         rowUpline = await Model.findOne({ memberId: rowUpline.uplineId });
//       }
//
//     }
//
//   }
//
//   res.json({
//     state: 'success',
//     message: 'Import Member berhasil',
//     data: data_,
//   });
//
// });

/************************
function post()
************************/
router.post('/', authMiddleware, validate, async (req, res, next) => {
  var data = req.body;

  file = xlsx.parse(`./public/writable/tmp/${data.file}`)[0].data;

  for (var i = 1;i < file.length; i++) {
    var memberId = file[i][0];
    var fullName = file[i][1];
    var firstName = fullName.split(' ').slice(0, -1).join(' ');
    var lastName = fullName.split(' ').slice(-1).join(' ');
    var email = file[i][2];
    var phoneNumber = file[i][3];
    var address = file[i][4];
    var uplineId = file[i][5];
    var position = file[i][6];
    var sponsorId = file[i][7];

    var memberType = 'Premium';
    var activation = 'Active';
    var salt = encrypt.cryptPassword(encrypt.uniqid());

    var password_ = '12345';
    var password = encrypt.cryptPassword(password_ + salt);
    var registeredOn = Date.now();

    var data_ = {
      memberId,
      fullName,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,

      memberType,
      activation,
      salt,
      password,
      stockiestSalt: salt,
      stockiestPassword: password,
      registeredOn,
    };

    var rowUpline = await Model.findOne({ memberId: uplineId });
    var rowSponsor = await Model.findOne({ memberId: sponsorId });

    if (rowUpline) {
      data_.uplineId = uplineId;
      data_.upline = rowUpline._id;
    }

    if (rowSponsor) {
      data_.sponsorId = sponsorId;
      data_.sponsor = rowSponsor._id;
    }

    await Model.create(data_);
    MemberXpModel.create({
      memberId,
      personalPv: 0,
      leftPv: 0,
      middlePv: 0,
      rightPv: 0,
      rangerUp: false,
      platinumRangerUp: false,
      ranger: {
        left: 0,
        middle: 0,
        right: 0,
      },
      platinumRanger: {
        left: 0,
        middle: 0,
        right: 0,
      },
    });

    if (rowUpline) {
      var rowMember = await Model.findOne({ memberId });
      switch (position) {
        // left
        case 0:
          rowUpline.leftFootId = memberId;
          rowUpline.leftFoot = rowMember._id;
          rowUpline.save();
          break;

        // middle
        case 1:
          rowUpline.middleFootId = memberId;
          rowUpline.middleFoot = rowMember._id;
          rowUpline.save();
          break;

        // right
        case 2:
          rowUpline.rightFootId = memberId;
          rowUpline.rightFoot = rowMember._id;
          rowUpline.save();
      }

      var lastMemberId = memberId;

      while(rowUpline) {
        if (rowUpline.leftFootId == lastMemberId) {
          var totalLeft = rowUpline.totalLeft || 0;
          totalLeft++;
          rowUpline.set({ totalLeft });
          rowUpline.save();
        }

        if (rowUpline.middleFootId == lastMemberId) {
          var totalMiddle = rowUpline.totalMiddle || 0;
          totalMiddle++;
          rowUpline.set({ totalMiddle });
          rowUpline.save();
        }

        if (rowUpline.rightFootId == lastMemberId) {
          var totalRight = rowUpline.totalRight || 0;
          totalRight++;
          rowUpline.set({ totalRight });
          rowUpline.save();
        }

        lastMemberId = rowUpline.memberId;
        rowUpline = await Model.findOne({ memberId: rowUpline.uplineId });
      }

    }

  }

  res.json({
    state: 'success',
    message: 'Import Member berhasil',
    data: data_,
  });

});


module.exports = router;
