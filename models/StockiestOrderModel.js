var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function CartSchema()
*********************/

var CartSchema = mongoose.Schema({
  productId: String,
  skuNumber: Number,
  productName: String,
  featuredImage: String,
  color: String,
  size: String,
  price: Number,
  qty: Number,
  subTotal: Number,
  point: Number,
});

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  code: String,
  resi: String,
  memberId: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  cart: [CartSchema],
  orderDate: Date,
  dueDate: Date,
  status: String,
}, {
  collection: 'stockiests_orders',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

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

Schema.virtual('shipmentCost_').get(function () {
  var shipmentCost = this.shipmentCost || 0;

  var formattedShipmentCost = currencyFormatter.format(shipmentCost, { code: 'IDR' });
  return formattedShipmentCost;
});

Schema.virtual('total').get(function () {
  var total = this.cart.reduce((total_, rowCart) => {
    total_ += (rowCart.qty * rowCart.price);
    return total_;
  }, 0);

  return total;
});

Schema.virtual('total_').get(function () {
  var formattedTotal = currencyFormatter.format(this.total, { code: 'IDR' });
  return formattedTotal;
});

mongoose.model('StockiestOrder', Schema);
