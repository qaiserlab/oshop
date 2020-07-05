var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  year: Number,
  month: Number,
  bonus: Number,
}, {
  collection: 'bonus_personal_spendings',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('monthName').get(function () {
  var monthName = '';

  switch (this.month) {
    case 1:
      monthName = 'Januari';
      break;
    case 2:
      monthName = 'Februari';
      break;
    case 3:
      monthName = 'Maret';
      break;
    case 4:
      monthName = 'April';
      break;
    case 5:
      monthName = 'Mei';
      break;
    case 6:
      monthName = 'Juni';
      break;
    case 7:
      monthName = 'Juli';
      break;
    case 8:
      monthName = 'Agustus';
      break;
    case 9:
      monthName = 'September';
      break;
    case 10:
      monthName = 'Oktober';
      break;
    case 11:
      monthName = 'Nopember';
      break;
    case 12:
      monthName = 'Desember';
  }

  return monthName;
});

Schema.virtual('bonus_').get(function () {
  var formattedBonus = currencyFormatter.format(this.bonus, { code: 'IDR' });
  return formattedBonus;
});

mongoose.model('BonusPersonalSpending', Schema);
