var mongoose = require('mongoose');
var slugify = require('slugify');
var currencyFormatter = require('currency-formatter');

/*********************
function CategorySchema()
*********************/

var CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: String,
});

/*********************
function PriceSchema()
*********************/

var PriceSchema = mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  discount: Number,
  quantity: Number,
});

/*********************
function virtual()
*********************/

PriceSchema.virtual('price_').get(function () {
  var formattedPrice = currencyFormatter.format(this.price, { code: 'IDR' });
  return formattedPrice;
});

/*********************
function ReviewSchema()
*********************/

var ReviewSchema = mongoose.Schema({
  writer: String,
  review: {
    type: String,
    required: true,
  },
  postedOn: Date,
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
function Schema()
*********************/
var Schema = mongoose.Schema({
  memberId: String,
  productName: String,
  slug: String,
  productId: String,
  skuNumber: String,
  weight: Number,
  point: Number,

  prices: {
    type: [PriceSchema],
    required: true,
  },

  overview: String,
  description: String,
  sizeGuide: String,
  publication: String,

  productCategory: {
    type: CategorySchema,
    required: true,
  },

  newItem: Boolean,
  bestSellerItem: Boolean,
  saleItem: Boolean,

  featuredImage: String,
  images: Array,

  reviews: [ReviewSchema],
  postedOn: Date,

  qty: Number,
  selectedGroup: SelectedGroupSchema,

}, {
  collection: 'carts',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strict: false,
});

/*********************
function virtual()
*********************/

Schema.virtual('orderDate_').get(function () {

  var date = new Date(this.orderDate);
  var formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + '/' + date.getFullYear();

  return formattedDate;
});

Schema.virtual('categoryPermalink').get(function () {

  var categorySlug = this.productCategory.slug;
  var permalink = '/shop/' + categorySlug;

  return permalink;
});

Schema.virtual('permalink').get(function () {
  var permalink = this.categoryPermalink + '/' + this.slug;
  return permalink;
});

Schema.virtual('featuredImage_').get(function () {
  // return '/writable/archives/' + this.featuredImage;
  return 'http://cozmeedid.imgix.net/' + this.featuredImage;
});

Schema.virtual('images_').get(function () {
  return this.images.map(image => {
    // return '/writable/archives/' + image;
    return 'http://cozmeedid.imgix.net/' + image;
  });
});

Schema.virtual('price').get(function () {
  var price = 0;

  if (this.prices.length > 0)
    price = this.prices[0].price;

  return price;
});

Schema.virtual('price_').get(function () {
  var formattedPrice = currencyFormatter.format(this.price, { code: 'IDR' });
  return formattedPrice;
});

Schema.virtual('priceGroup').get(function () {

  var priceGroup = {};
  this.prices.forEach(row => {

    if (!(row.color in priceGroup))
      priceGroup[row.color] = [];

    priceGroup[row.color].push({
      size: row.size,
      price: row.price,
      price_: row.price_,
      discount: row.discount,
      quantity: row.quantity,
    });

  });

  return priceGroup;
});

mongoose.model('Cart', Schema);
