var mongoose = require('mongoose-fill');
var currencyFormatter = require('currency-formatter');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  date: Date,
  description: String,
  in: Number,
  out: Number,
  balance: Number,
}, {
  collection: 'pins_stocks',
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

Schema.virtual('credit_').get(function () {
  var formattedBonus = currencyFormatter.format(this.credit, { code: 'IDR' });
  return formattedBonus;
});

Schema.virtual('debit_').get(function () {
  var formattedBonus = currencyFormatter.format(this.debit, { code: 'IDR' });
  return formattedBonus;
});

Schema.virtual('saldo_').get(function () {
  var formattedBonus = currencyFormatter.format(this.saldo, { code: 'IDR' });
  return formattedBonus;
});

/*********************
function fill()
*********************/

Schema.fill('rowMember', function (callback) {
  var MemberModel = mongoose.model('Member');
  MemberModel.findOne({ memberId: this.memberId }).exec(callback);
});

mongoose.model('PinStock', Schema);
