var mongoose = require('mongoose-fill');
var slugify = require('slugify');

var encrypt = require('../helpers/encrypt');
var upload = require('../helpers/upload');

var BonusSponsorModel = mongoose.model('BonusSponsorModel');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({

  // ID
  memberId: String,
  memberType: String,

  sponsorId: String,
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  uplineId: String,
  upline: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  // Foot
  leftFootId: String,
  leftFoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  middleFootId: String,
  middleFoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  rightFootId: String,
  rightFoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  totalLeft: Number,
  totalMiddle: Number,
  totalRight: Number,

  activation: String,

  // Profile
  firstName: String,
  lastName: String,
  photo: String,
  birthDate: Date,
  gender: String,

  // Contact
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: String,
  province: String,
  city: String,
  district: String,
  postalCode: String,

  // Bank
  bank: String,
  accountNumber: String,
  accountName: String,
  paymentMethod: String,

  // Password
  password: String,
  salt: String,
  stockiestPassword: String,
  stockiestSalt: String,

  // Stamp
  registeredOn: Date,

}, {
  collection: 'members',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('fullName').get(function () {
  var fullName = this.firstName;

  if (this.lastName)
    fullName += ' ' + this.lastName;

  return fullName;
});

Schema.virtual('birthDate__').get(function () {
  if (!this.birthDate)
    return '';

  var birthDate = new Date(this.birthDate);
  var formattedBirthDate = birthDate.getFullYear() + "-" + (birthDate.getMonth() + 1) + "-" + birthDate.getDate();

  return formattedBirthDate;
});

Schema.virtual('birthDate_').get(function () {
  if (!this.birthDate)
    return '';

  var birthDate = new Date(this.birthDate);
  var formattedBirthDate = birthDate.getDate() + "/" + (birthDate.getMonth() + 1) + "/" + birthDate.getFullYear();

  return formattedBirthDate;
});

Schema.virtual('bankAccount').get(function () {
  if (this.bank && this.accountNumber && this.accountName) {
    var bankAccount = this.bank + ' - ' + this.accountNumber + ' a/n ' + this.accountName;
  }
  else var bankAccount = '-';

  return bankAccount;
});

/*********************
function fill()
*********************/

Schema.fill('rsMensponsori', function (callback) {
  var MemberModel = mongoose.model('Member');
  MemberModel.find({ sponsorId: this.memberId }).exec(callback);
});

Schema.statics.findAll = function (data) {
  return new Promise((resolve, reject) => {

    this.find({}, (error, result) => {

      if (!error)
        resolve(result);
      else
        reject(error);
    });

  });
};

Schema.statics.findOneById = function (id) {
  return new Promise((resolve, reject) => {

    this.findById(id, '', (error, result) => {

      if (!error)
        resolve(result);
      else
        reject(error);
    });

  });
};

Schema.statics.createData = function (data) {
  return new Promise((resolve, reject) => {

    var salt = encrypt.cryptPassword(encrypt.uniqid());
    var password = encrypt.cryptPassword(data.password + salt);

    data.memberId = encrypt.shortid();
    data.salt = salt;
    data.password = password;
    data.registeredOn = Date.now();

    this.create(data, function (error) {
      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

Schema.statics.updateData = function (id, data) {
  return new Promise((resolve, reject) => {

    var slug = slugify(data.firstName, {
      replacement: '-',
      lower: true,
      remove: /[$*_+~.()'"!\-:@]/g,
    });

    if (data.photo)
      data.photo = upload.save(data.photo, slug);

    if (data.memberType == 'Premium' && data.activation == 'Active') {
      var fullName = data.firstName;
      if (data.lastName)
        fullName += ' ' + data.lastName;

      BonusSponsorModel.createData({
        memberId: data.sponsorId,
        fromId: data.memberId,
        fromName: fullName,
      });
    }

    this.findByIdAndUpdate(id, data, (error, data) => {
      if (!error) {
        this.findById(id, (error, data) => {
          resolve(data);
        });
      }
      else
        reject(error);
    });

  });
};

Schema.statics.deleteOneData = function (id) {
  return new Promise((resolve, reject) => {

    this.findByIdAndRemove(id, (error, data) => {

      upload.remove(data.photo);

      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

mongoose.model('Member', Schema);
