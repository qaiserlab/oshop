/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();
var pagination = require('pagination');

/************************
function modelDefiner()
************************/

var MemberModel = mongoose.model('Member');
var OrderModel = mongoose.model('Order');
var BankModel = mongoose.model('Bank');
var RegionalModel = mongoose.model('Regional');
var StockiestModel = mongoose.model('Stockiest');
var ShipmentCourierModel = mongoose.model('ShipmentCourier');
var ShipmentPriceModel = mongoose.model('ShipmentPrice');
var PaymentMethodModel = mongoose.model('PaymentMethod');

var ProductCategoryModel = mongoose.model('ProductCategory');
var ProductModel = mongoose.model('Product');

/************************
function siteMiddleware()
************************/
var siteMiddleware = require('../middleware/siteMiddleware');
router.use(siteMiddleware);

/************************
function authMiddleware()
************************/
var authMiddleware = require('../middleware/authMiddleware');

/************************
function renderSearch()
************************/
router.getAsync('/search', async (req, res, next) => {
  var keyword = req.query.keyword;

  var page = req.query.page || '1';
  if (!req.session.range) req.session.range = '10';
  if (req.query.range) req.session.range = req.query.range;
  var range = parseInt(req.session.range);
  page = parseInt(page);
  var skip = (page - 1) * range;

  var rsProductCount = await ProductModel.count({
    // productName: new RegExp('^'+keyword+'$', "i"),
    // productName: new RegExp('^'+keyword, "i"),
    // productName: { $regex: '.*' + keyword + '.*' },
    productName: new RegExp('.*' + keyword + '.*', "i"),
    publication: 'Publish',
  });
  var rsProduct = await ProductModel.find({
    // productName: new RegExp('^'+keyword+'$', "i"),
    // productName: new RegExp('^'+keyword, "i"),
    // productName: { $regex: '.*' + keyword + '.*' },
    productName: new RegExp('.*' + keyword + '.*', "i"),
    publication: 'Publish',
  }, '', { skip, limit: range });

  var paginator = createPaginator('/shop/search', page, range, rsProductCount);

  res.render('shop/SearchView', {
    keyword,
    rsProduct,
    paginator,
    pageRange: range,
  });
});

/************************
function renderIndex()
************************/
router.getAsync('/', async (req, res, next) => {

  var rsCategory = await ProductCategoryModel.find({
    showOnHomepage: true,
    publication: 'Publish'
  }).fill('rsProduct').exec();

  res.render('shop/ProductView', {
    rsCategory,
  });
});

function createPaginator(baseUrl, current, range, count) {
  return new pagination.TemplatePaginator({
    prelink:'/',
    current,
    rowsPerPage: range,
    totalResult: count,
    slashSeparator: true,

    template: function(result) {
      var i, len, prelink;
      var html = '<div><ul class="pagination">';
      if(result.pageCount < 2) {
        html += '</ul></div>';
        return html;
      }
      prelink = baseUrl + '?page=';
      if(result.previous) {
        html += '<li><a href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
      }
      if(result.range.length) {
        for( i = 0, len = result.range.length; i < len; i++) {
          if(result.range[i] === result.current) {
            html += '<li class="active"><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
          } else {
            html += '<li><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
          }
        }
      }
      if(result.next) {
        html += '<li><a href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
      }
      html += '</ul></div>';
      return html;
    }
  });
}

/************************
function renderCart()
************************/
router.getAsync('/cart', async (req, res, next) => {
  res.render('shop/CartView');
});

/************************
function renderCheckout()
************************/
router.use('/cart/checkout', authMiddleware);

router.getAsync('/cart/checkout', async (req, res, next) => {

  if (req.session.cart) {
    if (req.session.cart.length <= 0)
      return res.redirect('/shop/cart');
  }

  var rsBank = await BankModel.find({});
  var rsRegional = await RegionalModel.find({});
  var rsShipmentCourier = await ShipmentCourierModel.find({});
  var rsStockiest = await StockiestModel.find({}).populate('member');
  // var rsShipmentPrice = await ShipmentPriceModel.find({});
  var rsShipmentPrice = [];
  var rsPaymentMethod = await PaymentMethodModel.find({});

  var rowMember = await MemberModel.findById(req.session.userId);

  res.render('shop/CheckoutView', {
    rsBank,
    rsRegional,
    rsStockiest,
    rsShipmentCourier,
    rsShipmentPrice,
    rsPaymentMethod,
    rowMember,
  });
});

/************************
function renderConfirmPayment()
************************/
router.use('/confirm-payment', authMiddleware);

router.getAsync('/confirm-payment', async (req, res, next) => {
  var data = req.query;

  if (data.code)
    var code = data.code;
  else
    var code = '';

  var rowOrder = await OrderModel.findOne({ code }).populate('stockiest');
  var rsBankSender = BankModel.getBankList();
  var rsBank = await BankModel.find();

  // return res.json(rsBank);

  if (!rowOrder)
    return res.redirect('/404');

  var rowMember = await MemberModel.findById(req.session.userId);

  var date = new Date(Date.now());
  var confirmDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

  res.render('shop/ConfirmPayment', {
    code,
    rsBankSender,
    rsBank,
    rowMember,
    confirmDate,
  });
});

/************************
function renderProductCategory()
************************/
router.getAsync('/:category', async (req, res, next) => {

  var categorySlug = req.params.category;

  var page = req.query.page || '1';
  if (!req.session.range) req.session.range = '10';
  if (req.query.range) req.session.range = req.query.range;
  var range = parseInt(req.session.range);
  page = parseInt(page);
  var skip = (page - 1) * range;
  console.log('skip: ' + skip);

  var rowProductCategory = await ProductCategoryModel.findOne({ slug: categorySlug });

  if (!rowProductCategory)
    return res.redirect('/404');

  if (!rowProductCategory.parent) {
    var slugs = [];
    var rsProductCategory = await ProductCategoryModel.find({ parent: rowProductCategory.title });

    rsProductCategory.forEach(row => {
      slugs.push(row.slug);
    });

    var condition = { $in: slugs };
  }
  else
    var condition = categorySlug;

  var rsProductCount = await ProductModel.count({
    'productCategory.slug': condition,
    publication: 'Publish',
  });
  var rsProduct = await ProductModel.find({
    'productCategory.slug': condition,
    publication: 'Publish',
  }, '', { skip, limit: range });

  var paginator = createPaginator(categorySlug, page, range, rsProductCount);

  res.render('shop/ProductListView', {
    rowProductCategory,
    rsProduct,
    paginator,
    pageRange: range,
  });
});

/************************
function renderProductSingle()
************************/
router.getAsync('/:category/:product', async (req, res, next) => {

  var categorySlug = req.params.category;
  var slug = req.params.product;

  var rowProduct = await ProductModel.findOneBySlug(slug);
  if (!rowProduct) return res.redirect('/404');

  var rsProductSuggestion = await ProductModel.findAllBySuggestion(rowProduct);

  res.render('shop/ProductSingleView', {
    categorySlug,
    rowProduct,
    rsProductSuggestion,
  });
});

module.exports = router;
