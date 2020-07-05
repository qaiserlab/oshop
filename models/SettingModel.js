var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  settingId: Number,
  pinPrice: Number,
}, {
  collection: 'settings',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('pinPrice_').get(function () {
  var pinPrice = currencyFormatter.format(this.pinPrice, { code: 'IDR' });
  return pinPrice;
});

mongoose.model('Setting', Schema);
