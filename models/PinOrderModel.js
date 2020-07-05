var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');


/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({

  code: String,
  memberId: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  stockiestId: String,
  stockiest: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  price: Number,
  qty: Number,
  amount: Number,

  orderDate: Date,
  dueDate: Date,
  status: String,
}, {
  collection: 'pin_orders',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('price_').get(function () {
  return currencyFormatter.format(this.price, { code: 'IDR' });
});

Schema.virtual('total').get(function () {
  return this.price * this.qty;
});

Schema.virtual('total_').get(function () {
  return currencyFormatter.format(this.total, { code: 'IDR' });
});

Schema.virtual('orderDate_').get(function () {
  if (!this.orderDate)
    return '';

  var orderDate = new Date(this.orderDate);
  var formattedOrderDate = orderDate.getDate() + "/" + (orderDate.getMonth() + 1) + "/" + orderDate.getFullYear();

  return formattedOrderDate;
});

Schema.virtual('dueDate_').get(function () {
  if (!this.dueDate)
    return '';

  var dueDate = new Date(this.dueDate);
  var formattedDueDate = dueDate.getDate() + "/" + (dueDate.getMonth() + 1) + "/" + dueDate.getFullYear();

  return formattedDueDate;
});

mongoose.model('PinOrder', Schema);
