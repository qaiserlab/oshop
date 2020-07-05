var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  date: Date,
  ref: String,

  productId: String,
  color: String,
  size: String,

  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  
  description: String,
  in: Number,
  out: Number,
  balance: Number,
}, {
  collection: 'stocks',
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

mongoose.model('Stock', Schema);
