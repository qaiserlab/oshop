var mongoose = require('mongoose');
var encrypt = require('../helpers/encrypt');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  photo: String,
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,
  registeredOn: Date,
}, {
  collection: 'users',
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

Schema.statics.createData = function (data) {
  return new Promise((resolve, reject) => {

    var salt = encrypt.cryptPassword(encrypt.uniqid());
    var password = encrypt.cryptPassword(data.password + salt);

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
      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

mongoose.model('User', Schema);
