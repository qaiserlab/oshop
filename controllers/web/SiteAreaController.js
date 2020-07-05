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

var RegionalModel = mongoose.model('Regional');
var PaymentMethodModel = mongoose.model('PaymentMethod');
var ShipmentCourierModel = mongoose.model('ShipmentCourier');
var ShipmentPriceModel = mongoose.model('ShipmentPrice');

var BannerModel = mongoose.model('Banner');
var PageModel = mongoose.model('Page');
var NewsModel = mongoose.model('News');

var ProductCategoryModel = mongoose.model('ProductCategory');
var ProductModel = mongoose.model('Product');
var ForgotPasswordModel = mongoose.model('ForgotPassword');

/************************
function siteMiddleware()
************************/
var siteMiddleware = require('../middleware/siteMiddleware');
router.use(siteMiddleware);

/************************
function renderHome()
************************/
router.getAsync('/', async (req, res, next) => {

  var rsMainCategory = await ProductCategoryModel.find({ showOnHomepage: true, publication: 'Publish' });
  var rsNewProduct = await ProductModel.find({ newItem: true, publication: 'Publish' }).sort('-postedOn').limit(15);
  var rsBestSeller = await ProductModel.find({ bestSellerItem: true, publication: 'Publish' }).sort('-postedOn').limit(15);

  res.render('site/HomeView', {
    rsMainCategory,
    rsNewProduct,
    rsBestSeller,
  });
});

/************************
function render404()
************************/
router.getAsync('/404', async (req, res, next) => {
  res.render('site/404View');
});

/************************
function renderForgotPassword()
************************/
router.getAsync('/forgot-password', async (req, res, next) => {
  res.render('site/ForgotPasswordView');
});

/************************
function renderResetPassword()
************************/
router.getAsync('/reset-password/:token', async (req, res, next) => {
  var token = req.params.token;

  var rowForgotPassword = await ForgotPasswordModel.findOne({ code: token, status: 'Active' });
  if (!rowForgotPassword) return res.redirect('/404');

  if (Date.now() >= rowForgotPassword.dueDate) return res.redirect('/404');

  res.render('site/ResetPasswordView', {
    token: rowForgotPassword.code,
  });
});


/************************
function renderNews()
************************/
router.getAsync('/news', async (req, res, next) => {

  var page = req.query.page || '1';
  if (!req.session.range) req.session.range = '10';
  if (req.query.range) req.session.range = req.query.range;

  var range = parseInt(req.session.range);
  page = parseInt(page);
  var skip = (page - 1) * range;

  var rsNewsCount = await NewsModel.count({ publication: 'Publish' });
  var rsNews = await NewsModel.find({ publication: 'Publish' }, '', { skip, range });

  var paginator = createPaginator('/news', page, range, rsNewsCount);

  res.render('site/NewsView', {
    rsNews,
    paginator,
    pageRange: range,
  });
});

/************************
function renderNewsSingle()
************************/
router.getAsync('/news/:year/:month/:slug', async (req, res, next) => {

  var year = req.params.year;
  var month = req.params.month;
  var slug = req.params.slug;

  var rowNews = await NewsModel.findOne({ slug });

  res.render('site/NewsSingleView', {
    rowNews,
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
function renderSingle()
************************/
router.getAsync('/:page', async (req, res, next) => {

  var slug = req.params.page;

  var view = 'SingleView';
  var rowPage = await PageModel.findOne({ slug });

  if (!rowPage)
    return res.redirect('/404');

  if (rowPage.template) {
    if (rowPage.template != 'Default')
      view = rowPage.template + view;
  }

  view = 'site/templates/' + view;

  res.render(view, {
    rowPage,
  });
});

module.exports = router;
