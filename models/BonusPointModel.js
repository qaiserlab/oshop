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
  pv: Number,
}, {
  collection: 'bonus_points',
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

mongoose.model('BonusPoint', Schema);
