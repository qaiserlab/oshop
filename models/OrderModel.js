var mongoose = require('mongoose');
var currencyFormatter = require('currency-formatter');

/*********************
function DropshipSchema()
*********************/

var DropshipSchema = mongoose.Schema({
  isDropship: Boolean,
  firstName: String,
  lastName: String,
  address: String,
  province: String,
  city: String,
  district: String,
  postalCode: String,
  phoneNumber: String,
});

/*********************
function ShipmentSchema()
*********************/

var ShipmentSchema = mongoose.Schema({
  courier: String,
  service: String,
  description: String,
  price: Number,
});

/*********************
function CategorySchema()
*********************/

var CategorySchema = mongoose.Schema({
  title: String,
  slug: String,
});

/*********************
function SelectedGroupSchema()
*********************/

var SelectedGroupSchema = mongoose.Schema({
  size: String,
  price: String,
  price_: String,
  discount: Number,
  quantity: Number,
  color: String,
  subTotal: Number,
  subTotal_: String,
});

/*********************
function CartSchema()
*********************/

var CartSchema = mongoose.Schema({
  productId: String,
  slug: String,

  productCategory: CategorySchema,
  productName: String,

  weight: Number,
  point: Number,

  overview: String,
  description: String,
  sizeGuide: String,

  newItem: Boolean,
  bestSellerItem: Boolean,
  saleItem: Boolean,

  featuredImage: String,
  images: Array,

  qty: Number,

  selectedGroup: SelectedGroupSchema,

  publication: String,
  postedOn: Date,
});

/*********************
function ConfirmSchema()
*********************/

var ConfirmSchema = mongoose.Schema({
  code: String,
  fullName: String,
  bankSender: String,
  bankDestination: String,
  amount: Number,
  confirmDate: Date,
});

/*********************
function Schema()
*********************/
var Schema = mongoose.Schema({
  code: String,
  uniqueCode: Number,
  resi: String,

  memberId: String,
  memberName: String,

  firstName: String,
  lastName: String,
  address: String,
  province: String,
  city: String,
  district: String,
  postalCode: String,
  phoneNumber: String,

  dropship: DropshipSchema,
  stockiestId: String,
  stockiest: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  shipment: ShipmentSchema,
  paymentMethod: String,

  cart: [CartSchema],

  shipmentCost: Number,
  confirm: ConfirmSchema,

  orderDate: Date,
  dueDate: Date,
  status: String,

}, {
  collection: 'orders',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('member').get(function () {
  return this.memberId + ' / ' + this.memberName;
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

Schema.virtual('shipmentCost_').get(function () {
  var shipmentCost = this.shipmentCost || 0;

  var formattedShipmentCost = currencyFormatter.format(shipmentCost, { code: 'IDR' });
  return formattedShipmentCost;
});

Schema.virtual('total').get(function () {
  var total = this.cart.reduce((total_, rowCart) => {
    var price = 0;
    if (rowCart.selectedGroup) {
      if (rowCart.selectedGroup.price) price = rowCart.selectedGroup.price;
    }

    total_ += (rowCart.qty * price);
    return total_;
  }, 0);

  var shipmentCost = this.shipmentCost || 0;
  var uniqueCode = this.uniqueCode || 0;

  total += shipmentCost;
  total += uniqueCode;

  return total;
});

Schema.virtual('total_').get(function () {
  var formattedTotal = currencyFormatter.format(this.total, { code: 'IDR' });
  return formattedTotal;
});

mongoose.model('Order', Schema);
