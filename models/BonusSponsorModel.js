var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  fromId: String,
  fromName: String,
  date: Date,
  bonus: Number,
}, {
  collection: 'bonus_sponsors',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('date_').get(function () {
  if (!this.date)
    return '';

  var date = new Date(this.date);
  var formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  return formattedDate;
});

Schema.virtual('bonus_').get(function () {
  var formattedBonus = currencyFormatter.format(this.bonus, { code: 'IDR' });
  return formattedBonus;
});

Schema.statics.createData = function (data) {
  return new Promise((resolve, reject) => {

    var date = Date.now();
    var bonus = 25000;

    data.date = date;
    data.bonus = bonus;

    this.create(data, (error, data) => {
      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

Schema.statics.findAllByMonth = function (memberId, year, month) {
  return new Promise((resolve, reject) => {

    this.find({
      memberId,
      date: {
        $gte: new Date(year, parseInt(month) - 1, 1),
        $lte: new Date(year, parseInt(month) - 1, 30),
      },
    }, (error, result) => {

      if (!error)
        resolve(result);
      else
        reject(error);
    });

  });
};

mongoose.model('BonusSponsor', Schema);
