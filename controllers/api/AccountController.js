/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var jwt = require('jsonwebtoken');
var slugify = require('slugify');

var encrypt = require('../../helpers/encrypt');
var upload = require('../../helpers/upload');
var messager = require('../../helpers/messager');

var UserLogModel = mongoose.model('UserLog');
var MemberModel = mongoose.model('Member');
var UserModel = mongoose.model('User');
var ForgotPasswordModel = mongoose.model('ForgotPassword');
var MemberPvModel = mongoose.model('MemberPv');
var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');
var MemberXpModel = mongoose.model('MemberXp');
var StockiestModel = mongoose.model('Stockiest');
var PinModel = mongoose.model('Pin');
var PinStockModel = mongoose.model('PinStock');
var BonusSponsorModel = mongoose.model('BonusSponsor');
var EwalletModel = mongoose.model('Ewallet');

/************************
function put()
************************/
router.put('/', (req, res, next) => {
  var id = req.session.userId;
  var data = req.body;

  var model = new MemberModel(data);
  var error = model.validateSync();

  if (!error) {
    MemberModel.findByIdAndUpdate(id, data).then(result => {
      res.json({
        state: 'success',
        message: 'Sukses, mengubah data',
        data: result,
      });
    }).catch(error => {
      res.json({
        state: 'failed',
        message: 'Gagal, mengubah data',
        data: error,
      });
    });
  }
  else
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: error,
    });

});

/************************
function login()
************************/
router.post('/login', async (req, res, next) => {
  var data = req.body;

  var errors = {};

  if (data.type != 'user') {
    if (!data.mode)
      errors.mode = { message: 'Mode Login belum diisi' };
  }

  if (!data.email)
    errors.email = { message: 'Username belum diisi' };
  else {
    if (data.type != 'user')
      var rowMember = await MemberModel.findOne({ memberId: data.email });
    else
      var rowMember = await UserModel.findOne({ memberId: data.email });

    if (!rowMember)
      errors.email = { message: 'Username tidak terdaftar' };
    else {
      var stockiestId = data.email;
      data.email = rowMember.email;

      var rowStockiest = await StockiestModel.findOne({ memberId: stockiestId });
      if (data.mode == 'Stokist' && !rowStockiest)
        errors.email = { message: 'Anda tidak terdaftar sebagai stokist' };
    }
  }

  if (!data.password)
    errors.password = { message: 'Password belum diisi' };

  if (Object.keys(errors).length > 0)
    return res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });

  var type = data.type;

  var userLogModel = new UserLogModel({
    mode: data.mode,
    email: data.email,
    password: data.password,
    type,
  });

  var mode = data.mode;

  userLogModel.validate(function (error) {

    if (!error) {
      UserLogModel.login(data.email, data.type).then(data => {

        if (type == 'member') {

          StockiestModel.findOne({ memberId: data.memberId }, '', (error, rowStockiest) => {

            req.session.mode = mode;

            if (rowStockiest) {
              req.session.isStockiest = true;
              req.session.stockiestType = rowStockiest.type;
            }
            else {
              req.session.isStockiest = false;
              req.session.stockiestType = '';
            }

            req.session.authKey = data.authKey;
            req.session.login = data.login;

            req.session._id = data._id;
            req.session.userId = data.userId;
            req.session.memberId = data.memberId;
            req.session.memberType = data.memberType;

            req.session.email = data.email;
            req.session.fullName = data.fullName;

            res.json({
              state: 'success',
              message: 'Login berhasil',
              data,
            });
          });

        }
        else {

          if (rowMember.phoneNumber) data.phoneNumber = rowMember.phoneNumber;
          if (rowMember.photo) data.photo = rowMember.photo;

          res.json({
            state: 'success',
            message: 'Login berhasil',
            data,
          });
        }

      }).catch(error => {
        res.json({
          state: 'failed',
          message: 'Login gagal',
          data: error,
        });
      });
    }
    else {
      res.json({
        state: 'invalid',
        message: 'Silakan perbaiki kesalahan berikut;',
        data: error,
      });
    }
  });

});

/************************
function logout()
************************/
router.post('/logout', (req, res, next) => {
  var data = req.body;

  UserLogModel.logout(data.email, data.authKey).then(data => {

    if (req.session.authKey) {
      req.session.authKey = '';
      req.session.email = '';
      req.session.fullName = '';
    }

    res.json({
      state: 'success',
      message: 'Logout success',
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Logout failed',
    });
  });

});

async function validateForgotPassword(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.username)
    errors.username = { message: `Username/Email belum diisi` };
  else {
    var rowMember = await MemberModel.findOne({ memberId: data.username });

    if (!rowMember) {
      var rowMember = await MemberModel.findOne({ email: data.username });
      if (!rowMember) {
        errors.username = { message: `Username/Email yg Anda masukan tidak terdaftar` };
      }
    }
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
function forgotPassword()
************************/
router.post('/forgot-password', validateForgotPassword, async (req, res, next) => {
  var data = req.body;

  var code = encrypt.shortid();

  var rowMember = await MemberModel.findOne({ memberId: data.username });
  if (!rowMember) {
    var rowMember = await MemberModel.findOne({ email: data.username });
  }

  var memberId = rowMember.memberId;
  var email = rowMember.email;
  var postedOn = Date.now();
  var dueDate = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Active';

  ForgotPasswordModel.create({
    code,
    memberId,
    email,
    postedOn,
    dueDate,
    status,
  });

  messager.sendMail(
    [email],
    'Cozmeed - Reset Password',
    'Silakan klik link dibawah ini untuk me-reset password akun Cozmeed Anda;<br><br>' +
    '<a href="http://cozmeed.id/reset-password/' + code + '">RESET PASSWORD</a>'
  );

  res.json({
    state: 'success',
    message: 'Email telah terkirim',
    data: {},
  });
});

async function validateResetPassword(req, res, next) {
  var data = req.body;
  var token = data.token;
  var errors = {};

  if (!token)
    errors.passwordBaru = { message: `Tidak ada hak akses utk me-reset Password` };
  else {
    var rowForgotPassword = await ForgotPasswordModel.findOne({ code: token, status: 'Active' });
    // var rowMember = await MemberModel.findOne({ memberId: data.username });
    if (!rowForgotPassword)
      errors.passwordBaru = { message: `Tidak ada hak akses utk me-reset Password` };
  }

  if (!data.newPassword)
    errors.newPassword = { message: `Password Baru belum diisi` };

  if (!data.retypePassword)
    errors.retypePassword = { message: `Password Baru belum diulangi` };

  if (data.newPassword && data.retypePassword) {
    if (data.newPassword != data.retypePassword)
      errors.retypePassword = { message: `Password yg diulangi tidak sama` };
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
function resetPassword()
************************/
router.post('/reset-password', validateResetPassword, async (req, res, next) => {
  var data = req.body;
  var token = data.token;

  var rowForgotPassword = await ForgotPasswordModel.findOne({ code: token, status: 'Active' });
  var memberId = rowForgotPassword.memberId;

  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var password = encrypt.cryptPassword(data.newPassword + salt);

  var rowMember = await MemberModel.findOne({ memberId });

  rowMember.password = password;
  rowMember.salt = salt;
  if (rowMember.stockiestPassword)
    rowMember.stockiestPassword = password;

  if (rowMember.stockiestSalt)
    rowMember.stockiestSalt = salt;

  rowMember.save();
  rowForgotPassword.status = 'Inactive';
  rowForgotPassword.save();

  res.json({
    state: 'success',
    message: 'Password berhasil di-reset',
    data: {},
  });
});

/************************
function generateSponsor()
************************/
router.get('/generate-sponsor', (req, res, next) => {

  // Get the count of all users
  // MemberModel.count().exec(function (err, count) {
  //
  //   // Get a random entry
  //   var random = Math.floor(Math.random() * count);
  //
  //   // Again query all users but only fetch one offset by our random #
  //   MemberModel.findOne().skip(random).exec(
  //     function (err, row) {
  //       res.json({
  //         state: 'success',
  //         message: 'Sponsor ID telah dibuat',
  //         data: row.memberId,
  //       });
  //     });
  // });

  var memberIds = ['C01234567','C01234567a','C01234567b','C01234567c'];
  var memberId = memberIds[Math.floor(Math.random()*memberIds.length)];

  res.json({
    state: 'success',
    message: 'Sponsor ID telah dibuat',
    data: memberId,
  });

});

async function validateRegister(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.serialNumber)
    errors.serialNumber = { message: `Serial Number belum diisi` };

  if (!data.pin)
    errors.pin = { message: `PIN belum diisi` };

  if (data.serialNumber && data.pin) {

    var rowPin = await PinModel.findOne({
      serialNumber: data.serialNumber,
      pin: data.pin,
    });
    req.rowPin = rowPin;

    if (!rowPin)
      errors.pin = { message: `Serial Number/PIN salah` };
    else {
      if (rowPin.isActive)
        errors.pin = { message: `Serial Number/PIN sudah dipakai` };

      if (rowPin.sponsorId != req.session.memberId)
        errors.pin = { message: `Serial Number/PIN tidak dapat digunakan` };
    }
  }

  if (!data.memberId)
    errors.memberId = { message: `Username belum diisi` };
  else {

    if (data.memberId.length > 12) {
      errors.memberId = { message: `Username tidak boleh lebih dari 12 karakter` };
    }
    else {

      var rowMember = await MemberModel.findOne({
        memberId: data.memberId,
      });

      if (rowMember)
        errors.memberId = { message: `Username sudah dipakai` };

    }
  }

  if (!data.firstName)
    errors.firstName = { message: `Nama Depan belum diisi` };

  if (!data.lastName)
    errors.lastName = { message: `Nama Belakang belum diisi` };

  if (!data.email)
    errors.email = { message: `Email belum diisi` };
  else {
    var rsMember = await MemberModel.find({ email: data.email });
    if (rsMember.length > 0)
      errors.email = { message: `Email '${data.email}' sudah terdaftar sebelumnya` };
  }

  if (!data.phoneNumber)
    errors.phoneNumber = { message: `No. Telepon belum diisi` };

  if (!data.password)
    errors.password = { message: `Password belum diisi` };
  else {
    if (data.password.length < 6)
      errors.password = { message: `Password harus 6 karakter atau lebih` };
  }

  if (!data.retypePassword)
    errors.retypePassword = { message: `Konfirmasi belum diisi` };
  else {
    if (data.password) {
      if (data.password != data.retypePassword)
        errors.retypePassword = { message: `Konfirmasi tidak sama` };
    }
  }

  if (!data.bank)
    errors.bank = { message: `Bank belum diisi` };

  if (!data.accountNumber)
    errors.accountNumber = { message: `No. Rek. belum diisi` };

  if (!data.accountName)
    errors.accountName = { message: `Pemilik belum diisi` };
    
  if (data.uplineId) {
    var rowUpline = await MemberModel.findOne({ memberId: data.uplineId });
    if (!rowUpline) {
      errors.uplineId = { message: `Upline tidak ditemukan` };
    }
    else {
      var found = false;
      while(rowUpline) {
        if (rowUpline.memberId == req.session.memberId) found = true;
        rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
      }
      
      if (!found)
        errors.uplineId = { message: `Upline ini bukan merupakan downline Anda` };
    }
  }

  if (!data.position)
    errors.position = { message: `Posisi belum dipilih` };

  if (Object.keys(errors).length > 0)
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });
  else
    next();
}

async function addMemberPv(memberId, pv, position) {
  var date = Date.now();

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;

  var data = {
    memberId,
    date,
    personalPv: 0,
    leftPv: 0,
    middlePv: 0,
    rightPv: 0,
  };

  data[position + 'Pv'] = pv;
  MemberPvModel.create(data);

  var rowMemberMonthlyPv = await MemberMonthlyPvModel.findOne({
    memberId,
    year,
    month,
  });

  if (!rowMemberMonthlyPv) {
    data = {
      memberId,
      year,
      month,
      personalPv: 0,
      leftPv: 0,
      middlePv: 0,
      rightPv: 0,
    };
    data[position + 'Pv'] = pv;

    MemberMonthlyPvModel.create(data);
  }
  else {
    rowMemberMonthlyPv[position + 'Pv'] += pv;
    rowMemberMonthlyPv.save();
  }
}

/************************
function register()
************************/
router.post('/register', validateRegister, async (req, res, next) => {
  var data = req.body;
  var rowPin = req.rowPin;

  var sponsorId = data.sponsorId?data.sponsorId:req.session.memberId;
  var uplineId = data.uplineId?data.uplineId:sponsorId;
  // var memberId = encrypt.shortid();
  var memberId = data.memberId;
  var memberType = 'Premium';
  var activation = 'Active';
  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var password = encrypt.cryptPassword(data.password + salt);
  var registeredOn = Date.now();

  data.sponsorId = sponsorId;
  data.uplineId = uplineId;
  // data.memberId = memberId;
  data.memberType = memberType;
  data.activation = activation;
  data.salt = salt;
  data.password = password;
  data.registeredOn = registeredOn;

  var memberModel = new MemberModel(data);
  var rowSaved = await memberModel.save();
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

  // Bonus Sponsor

  var bonus = 100000;

  BonusSponsorModel.create({
    memberId: sponsorId,
    fromId: memberId,
    fromName: data.firstName + ' ' + data.lastName,
    date: registeredOn,
    bonus,
  });
  EwalletModel.create({
    memberId: sponsorId,
    date: registeredOn,
    credit: bonus,
    debit: 0,
    saldo: 0,
    description: 'Insentif Pertumbuhan Jaringan',
  });

  // PIN

  rowPin.set({ isActive: 1 });
  rowPin.save();

  var date = Date.now();
  var description = 'Registrasi Member baru';
  var in_ = 0;
  var out_ = 1;

  PinStockModel.create({
    memberId: req.session.memberId,
    date,
    description,
    'in': in_,
    'out': out_,
  });

  // Storing Sponsor & Upline

  var rowSponsor = await MemberModel.findOne({ memberId: rowSaved.sponsorId });
  var rowUpline = await MemberModel.findOne({ memberId: rowSaved.uplineId });

  rowSaved.set({ sponsor: rowSponsor._id, upline: rowUpline._id });
  rowSaved.save();

  switch (parseInt(data.position)) {
    case 1:
      rowUpline.set({
        leftFootId: rowSaved.memberId,
        leftFoot: rowSaved._id,
      });
      break;
    case 2:
      rowUpline.set({
        middleFootId: rowSaved.memberId,
        middleFoot: rowSaved._id,
      });
      break;
    case 3:
      rowUpline.set({
        rightFootId: rowSaved.memberId,
        rightFoot: rowSaved._id,
      });
  }

  await rowUpline.save(data);
  var rowFirstUpline = rowUpline;

  // Total foot

  var lastMemberId = rowSaved.memberId;
  // var totalLeft = 0;
  // var totalMiddle = 0;
  // var totalRight = 0;

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
    rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
  }

  // BONUS 2 PV FOR ALL UPLINE

  rowUpline = rowFirstUpline;

  var lastMemberId = rowSaved.memberId;
  var pv = 2;

  while(rowUpline) {
    rowMemberXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });

    if (rowUpline.leftFootId == lastMemberId) {

      addMemberPv(rowUpline.memberId, pv, 'left');

      if (rowMemberXp) {
        rowMemberXp.leftPv += pv;
        await rowMemberXp.save();
      }
      else {
        await MemberXpModel.create({
          memberId: rowUpline.memberId,
          personalPv: 0,
          leftPv: pv,
          middlePv: 0,
          rightPv: 0,
        });
        rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
      }
    }
    else if (rowUpline.middleFootId == lastMemberId) {

      addMemberPv(rowUpline.memberId, pv, 'middle');

      if (rowMemberXp) {
        rowMemberXp.middlePv += pv;
        await rowMemberXp.save();
      }
      else {
        await MemberXpModel.create({
          memberId: rowUpline.memberId,
          personalPv: 0,
          leftPv: 0,
          middlePv: pv,
          rightPv: 0,
        });
        rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
      }
    }
    else if (rowUpline.rightFootId == lastMemberId) {

      addMemberPv(rowUpline.memberId, pv, 'right');

      if (rowMemberXp) {
        rowMemberXp.rightPv += pv;
        await rowMemberXp.save();
      }
      else {
        await MemberXpModel.create({
          memberId: rowUpline.memberId,
          personalPv: 0,
          leftPv: 0,
          middlePv: 0,
          rightPv: pv,
        });
        rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
      }
    }

    lastMemberId = rowUpline.memberId;
    rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
  }

  res.json({
    state: 'success',
    message: 'Member baru telah ter-registrasi',
    data: rowSaved,
  });

});

async function validateRegisterPremium(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.sponsorId)
    errors.sponsorId = { message: `ID Sponsor belum diisi` };

  if (!data.memberId)
    errors.memberId = { message: `Username belum diisi` };
  else {
    if (/\s/.test(data.memberId)) {
      errors.memberId = { message: `Username tidak boleh mengandung spasi` };
    }
    else {

      if (data.memberId.length > 12) {
        errors.memberId = { message: `Username tidak boleh lebih dari 12 karakter` };
      }
      else {
        var rowMember = await MemberModel.findOne({
          memberId: data.memberId,
        });

        if (rowMember)
        errors.memberId = { message: `Username sudah dipakai` };
      }
    }

  }

  if (!data.firstName)
    errors.firstName = { message: `Nama Depan belum diisi` };

  if (!data.lastName)
    errors.lastName = { message: `Nama Belakang belum diisi` };

  if (!data.email)
    errors.email = { message: `Email belum diisi` };
  else {
    var rsMember = await MemberModel.find({ email: data.email });
    if (rsMember.length > 0)
      errors.email = { message: `Email '${data.email}' sudah terdaftar sebelumnya` };
  }

  if (!data.phoneNumber)
    errors.phoneNumber = { message: `No. Telepon belum diisi` };

  if (!data.password)
    errors.password = { message: `Password belum diisi` };
  else {
    if (data.password.length < 6)
      errors.password = { message: `Password harus 6 karakter atau lebih` };
  }

  if (!data.retypePassword)
    errors.retypePassword = { message: `Konfirmasi belum diisi` };
  else {
    if (data.password) {
      if (data.password != data.retypePassword)
        errors.retypePassword = { message: `Konfirmasi tidak sama` };
    }
  }

  if (!data.bank)
    errors.bank = { message: `Bank belum diisi` };

  if (!data.accountNumber)
    errors.accountNumber = { message: `No. Rek. belum diisi` };

  if (!data.accountName)
    errors.accountName = { message: `Pemilik belum diisi` };


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
function registerPremium()
************************/
router.post('/register-premium', validateRegisterPremium, async (req, res, next) => {
  var data = req.body;

  // var sponsorId = data.sponsorId?data.sponsorId:req.session.memberId;

  var memberId = data.memberId;
  var memberType = 'Premium';
  var activation = 'Pending';
  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var password = encrypt.cryptPassword(data.password + salt);
  var registeredOn = Date.now();

  var rowSponsor = await MemberModel.findOne({ memberId: data.sponsorId });
  data.sponsor = rowSponsor._id;

  data.memberType = memberType;
  data.activation = activation;
  data.salt = salt;
  data.password = password;
  data.stockiestSalt = salt;
  data.stockiestPassword = password;
  data.registeredOn = registeredOn;

  var memberModel = new MemberModel(data);
  var rowSaved = await memberModel.save();
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

  var email = data.email;
  var phoneNumber = data.phoneNumber;

  messager.sendMail(
    [email],
    'Terima Kasih Telah Mendaftar di Cozmeed',
    'Terima kasih, telah melakukan pendaftaran di Cozmeed. Akun Anda belum aktif dan sedang menunggu konfirmasi dari sponsor yg Anda pilih'
  );
  if (phoneNumber)
    messager.sendSms(phoneNumber,
      'Terima kasih, telah melakukan pendaftaran di Cozmeed. Akun Anda belum aktif dan sedang menunggu konfirmasi dari sponsor yg Anda pilih'
    );

  res.json({
    state: 'success',
    message: 'Member baru telah ter-registrasi',
    data: rowSaved,
  });

});

async function validateApprove(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.pin)
    errors.pin = { message: `PIN belum diisi` };
  else {

    var rowPin = await PinModel.findOne({
      pin: data.pin,
      serialNumber: data.serialNumber,
    });
    req.rowPin = rowPin;

    if (!rowPin)
      errors.pin = { message: `PIN/Serial Number salah` };
    else {
      if (rowPin.isActive)
        errors.pin = { message: `PIN/Serial Number sudah dipakai` };

      if (rowPin.sponsorId != req.session.memberId)
        errors.pin = { message: `PIN/Serial Number tidak dapat digunakan` };
    }
  }

  if (data.uplineId) {
    var rowUpline = await MemberModel.findOne({ memberId: data.uplineId });
    if (!rowUpline)
      errors.uplineId = { message: `Upline tidak ditemukan` };
  }

  if (!data.position)
    errors.position = { message: `Posisi belum dipilih` };

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
router.post('/approve', validateApprove, async (req, res, next) => {
  var data = req.body;

  var rowMember = await MemberModel.findOne({ memberId: data.memberId });
  var fullName = rowMember.firstName + ' ' + rowMember.lastName;
  var email = rowMember.email;
  var phoneNumber = rowMember.phoneNumber;

  if (!data.uplineId)
    data.uplineId = req.session.memberId;
  var rowUpline = await MemberModel.findOne({ memberId: data.uplineId });

  // Bonus Sponsor

  var registeredOn = Date.now();
  var bonus = 100000;

  BonusSponsorModel.create({
    memberId: rowMember.sponsorId,
    fromId: rowMember.memberId,
    fromName: rowMember.fullName,
    date: registeredOn,
    bonus,
  });
  EwalletModel.create({
    memberId: rowMember.sponsorId,
    date: registeredOn,
    credit: bonus,
    debit: 0,
    saldo: 0,
    description: 'Insentif Pertumbuhan Jaringan',
  });

  // PIN

  var rowPin = await PinModel.findOne({
    pin: data.pin,
    serialNumber: data.serialNumber,
  });

  rowPin.set({ isActive: 1 });
  rowPin.save();

  var date = Date.now();
  var description = 'Registrasi Member baru';
  var in_ = 0;
  var out_ = 1;

  PinStockModel.create({
    memberId: req.session.memberId,
    date,
    description,
    'in': in_,
    'out': out_,
  });

  //

  rowMember.set({
    uplineId: data.uplineId,
    upline: rowUpline._id,
    activation: 'Active',
  });
  rowMember.save();

  switch (parseInt(data.position)) {
    case 1:
      rowUpline.set({
        leftFootId: rowMember.memberId,
        leftFoot: rowMember._id,
      });
      break;
    case 2:
      rowUpline.set({
        middleFootId: rowMember.memberId,
        middleFoot: rowMember._id,
      });
      break;
    case 3:
      rowUpline.set({
        rightFootId: rowMember.memberId,
        rightFoot: rowMember._id,
      });
  }

  await rowUpline.save(data);

  // Total foot

  var lastMemberId = rowMember.memberId;

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
    rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
  }

  messager.sendMail(
    [email],
    'Selamat Bergabung bersama Cozmeed',
    'Selamat ' + fullName + ' Anda telah diterima sebagai salah satu Member Cozmeed, <br>' +
    'silakan melakukan login di <a href="http://cozmeed.id">cozmeed.id</a> untuk melihat profil Anda'
  );
  if (phoneNumber)
    messager.sendSms(phoneNumber,
      'Selamat ' + fullName + ' Anda telah diterima sebagai salah satu Member Cozmeed,' +
      'silakan melakukan login di cozmeed.id untuk melihat profil Anda'
  );

  res.json({
    state: 'success',
    message: 'Member baru telah ter-registrasi',
    data: rowMember,
  });

});

async function validateChangePassword(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.oldPassword)
    errors.oldPassword = { message: `Password Lama belum diisi` };
  else {
    var rowMember = await MemberModel.findOne({ memberId: req.session.memberId });

    if (req.session.mode == 'Member') {
      var encryptedPassword = encrypt.cryptPassword(data.oldPassword + rowMember.salt);
      var oldPassword_ = rowMember.password;
    }
    else if (req.session.mode == 'Stokist') {
      var encryptedPassword = encrypt.cryptPassword(data.oldPassword + rowMember.stockiestSalt);
      var oldPassword_ = rowMember.stockiestPassword;
    }

    if (encryptedPassword != oldPassword_)
      errors.oldPassword = { message: `Password Lama salah` };
  }

  if (!data.newPassword)
    errors.newPassword = { message: `Password Baru belum diisi` };

  if (!data.retypePassword)
    errors.retypePassword = { message: `Password belum diulangi` };

  if (data.newPassword && data.retypePassword) {
    if (data.newPassword != data.retypePassword)
      errors.retypePassword = { message: `Password yg diulangi tidak sama` };
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
function changePassword()
************************/
router.put('/change-password', validateChangePassword, async (req, res, next) => {
  var data = req.body;

  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var encryptedPassword = encrypt.cryptPassword(data.newPassword + salt);

  var rowMember = await MemberModel.findOne({ memberId: req.session.memberId });

  if (req.session.mode == 'Member') {
    rowMember.password = encryptedPassword;
    rowMember.salt = salt;
  }
  else if (req.session.mode == 'Stokist') {
    rowMember.stockiestPassword = encryptedPassword;
    rowMember.stockiestSalt = salt;
  }

  rowMember.save();

  res.json({
    state: 'success',
    message: 'Password berhasil diubah',
  });
});

async function validateChangeStockiestPassword(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.oldPassword)
    errors.oldPassword = { message: `Password Lama belum diisi` };
  else {
    var rowMember = await MemberModel.findOne({ memberId: req.session.memberId });

    var encryptedPassword = encrypt.cryptPassword(data.oldPassword + rowMember.stockiestSalt);
    var oldPassword_ = rowMember.stockiestPassword;

    if (encryptedPassword != oldPassword_)
      errors.oldPassword = { message: `Password Lama salah` };
  }

  if (!data.newPassword)
    errors.newPassword = { message: `Password Baru belum diisi` };

  if (!data.retypePassword)
    errors.retypePassword = { message: `Password belum diulangi` };

  if (data.newPassword && data.retypePassword) {
    if (data.newPassword != data.retypePassword)
      errors.retypePassword = { message: `Password yg diulangi tidak sama` };
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
function changeStockiestPassword()
************************/
router.put('/change-stockiest-password', validateChangeStockiestPassword, async (req, res, next) => {
  var data = req.body;

  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var encryptedPassword = encrypt.cryptPassword(data.newPassword + salt);

  var rowMember = await MemberModel.findOne({ memberId: req.session.memberId });

  rowMember.stockiestPassword = encryptedPassword;
  rowMember.stockiestSalt = salt;

  rowMember.save();

  res.json({
    state: 'success',
    message: 'Password Stokist berhasil diubah',
  });
});

async function validateUpdateUserProfile(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.firstName)
    errors.firstName = { message: `Nama Depan belum diisi` };

  if (!data.email)
    errors.email = { message: `Email belum diisi` };

  if (!data.phoneNumber)
    errors.phoneNumber = { message: `No. Telp belum diisi` };

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
function updateUserProfile()
************************/
router.put('/update-user-profile/:authKey', validateUpdateUserProfile, async (req, res, next) => {
  var data = req.body;
  var authKey = req.params.authKey;

  var rowUserLog = await UserLogModel.findOne({ authKey });
  var rowUser = await UserModel.findOne({ email: rowUserLog.email });

  rowUser.firstName = data.firstName;
  rowUser.lastName = data.lastName;
  // rowUser.email = data.email;
  rowUser.phoneNumber = data.phoneNumber;

  var slug = slugify(rowUser.memberId, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var randomnumber = Math.floor(Math.random()*100) + 1;
  slug += '-' + randomnumber;

  var photo = upload.save(data.photo, slug);
  rowUser.photo = photo;

  await rowUser.save();

  res.json({
    state: 'success',
    message: 'Profile berhasil diubah',
    data: rowUser,
  });
});

async function validateUpdateUserPassword(req, res, next) {
  var data = req.body;
  var authKey = req.params.authKey;
  var errors = {};

  if (!data.oldPassword)
    errors.oldPassword = { message: `Password Lama belum diisi` };
  else {
    var rowUserLog = await UserLogModel.findOne({ authKey });
    var rowUser = await UserModel.findOne({ email: rowUserLog.email });

    var password = encrypt.cryptPassword(data.oldPassword + rowUser.salt);

    if (password != rowUser.password)
      errors.oldPassword = { message: `Password Lama salah` };
  }

  if (!data.newPassword)
    errors.newPassword = { message: `Password Baru belum diisi` };

  if (!data.retypePassword)
    errors.retypePassword = { message: `Password Baru belum diulangi` };

  if (data.newPassword && data.retypePassword) {
    if (data.newPassword != data.retypePassword) {
      errors.retypePassword = { message: `Password Baru yg diulangi tidak sama` };
    }
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
function updateUserPassword()
************************/
router.put('/update-user-password/:authKey', validateUpdateUserPassword, async (req, res, next) => {
  var data = req.body;
  var authKey = req.params.authKey;

  var rowUserLog = await UserLogModel.findOne({ authKey });
  var rowUser = await UserModel.findOne({ email: rowUserLog.email });

  var salt = encrypt.cryptPassword(encrypt.uniqid());
  var password = encrypt.cryptPassword(data.newPassword + salt);

  rowUser.password = password;
  rowUser.salt = salt;

  await rowUser.save();

  res.json({
    state: 'success',
    message: 'Password berhasil diubah',
    data: {},
  });
});

async function validateUpdateBankAccount(req, res, next) {
  var data = req.body;
  var errors = {};

  console.log('MODE:');
  console.log(req.session.mode);

  if (!data.password)
    errors.password = { message: `Password belum diisi` };

  if (!data.retypePassword)
    errors.retypePassword = { message: `Password belum diulangi` };

  if (data.password && data.retypePassword) {
    if (data.password != data.retypePassword)
      errors.retypePassword = { message: `Password yg diulangi tidak sama` };
    else {
      var rowMemberModel = await MemberModel.findOne({ memberId: req.session.memberId });

      if (req.session.mode == 'Member') {
        var salt_ = rowMemberModel.salt;
        var password_ = rowMemberModel.password;
      }
      else {
        var salt_ = rowMemberModel.stockiestSalt;
        var password_ = rowMemberModel.stockiestPassword;
      }

      var password = encrypt.cryptPassword(data.password + salt_);

      if (password != password_)
        errors.password = { message: `Password salah` };

    }
  }

  if (!data.bank)
    errors.bank = { message: `Bank belum diisi` };

  if (!data.accountName)
    errors.accountName = { message: `Nama Pemilik Rekening belum diisi` };

  if (!data.accountNumber)
    errors.accountNumber = { message: `No. Rekening belum diisi` };

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
function updateBankAccount()
************************/
router.put('/update-bank-account', validateUpdateBankAccount, async (req, res, next) => {
  var id = req.session.userId;
  var data = req.body;
  var data_ = {
    bank: data.bank,
    accountName: data.accountName,
    accountNumber: data.accountNumber,
  };

  MemberModel.findByIdAndUpdate(id, data_).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, mengubah data',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, mengubah data',
      data: error,
    });
  });
});

module.exports = router;
