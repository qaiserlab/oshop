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
  total: Number,
  bonus: Number,
}, {
  collection: 'bonus_direct_sellings',
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

Schema.virtual('total_').get(function () {
  var formattedTotal = currencyFormatter.format(this.total, { code: 'IDR' });
  return formattedTotal;
});

Schema.virtual('bonus_').get(function () {
  var formattedBonus = currencyFormatter.format(this.bonus, { code: 'IDR' });
  return formattedBonus;
});

mongoose.model('BonusDirectSelling', Schema);
