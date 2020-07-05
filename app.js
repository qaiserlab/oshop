var mongoose = require('mongoose');
var loader = require('mongoose-model-loader');

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

// MongoDB

// var db = mongoose.connect('mongodb://127.0.0.1/oshop', {
try {
  var db = mongoose.connect('mongodb+srv://qaiserdev:m30ngm30ngAA@cluster0-51geo.mongodb.net/db_marketplace?retryWrites=true&w=majority', {
    server: {
      socketOptions: {
        socketTimeoutMS: 0,
        connectionTimeout: 0
      }
    }
  });
} catch (error) {
  console.error.bind(console, 'Mongodb connection error:');
}

// db.on('error', );
// db.once('open', function() {
//   console.log("Mongodb connected using mongoose!");
//   require('./tasks/bonus');
// });
loader(__dirname + '/models');

var app = express();

// Session

app.use(session({
  secret: 'COZMEED-PIA',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'assets/images/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');

// Web Controllers

var SiteAreaController = require('./controllers/web/SiteAreaController');
var ShopAreaController = require('./controllers/web/ShopAreaController');
var RegisterAreaController = require('./controllers/web/RegisterAreaController');
var MemberAreaController = require('./controllers/web/MemberAreaController');

// Api Controllers

var SystemController = require('./controllers/api/SystemController');
var AccountController = require('./controllers/api/AccountController');
var SettingController = require('./controllers/api/SettingController');

var PageController = require('./controllers/api/PageController');
var NewsController = require('./controllers/api/NewsController');
var BannerController = require('./controllers/api/BannerController');
var ImageController = require('./controllers/api/ImageController');
var MenuController = require('./controllers/api/MenuController');
var MailboxController = require('./controllers/api/MailboxController');

var MemberController = require('./controllers/api/MemberController');
var ImportMemberController = require('./controllers/api/ImportMemberController');
var PinController = require('./controllers/api/PinController');
var PinStockController = require('./controllers/api/PinStockController');
var PinOrderController = require('./controllers/api/PinOrderController');
var StockiestController = require('./controllers/api/StockiestController');
var BankController = require('./controllers/api/BankController');
var ProductController = require('./controllers/api/ProductController');
var ProductCategoryController = require('./controllers/api/ProductCategoryController');
var CartController = require('./controllers/api/CartController');
var OrderController = require('./controllers/api/OrderController');
var StockiestOrderController = require('./controllers/api/StockiestOrderController');
var WithdrawController = require('./controllers/api/WithdrawController');
var ReportController = require('./controllers/api/ReportController');
var ShipmentPriceController = require('./controllers/api/ShipmentPriceController');

// Api v2 Controllers

var SystemApi = require('./controllers/v2/api/SystemController');
var AccountApi = require('./controllers/v2/api/AccountController');
var SettingApi = require('./controllers/v2/api/SettingController');

var PageApi = require('./controllers/v2/api/PageController');
var NewsApi = require('./controllers/v2/api/NewsController');
var BannerApi = require('./controllers/v2/api/BannerController');
var ImageApi = require('./controllers/v2/api/ImageController');
var MenuApi = require('./controllers/v2/api/MenuController');
var MailboxApi = require('./controllers/v2/api/MailboxController');

var MemberApi = require('./controllers/v2/api/MemberController');
var ImportMemberApi = require('./controllers/v2/api/ImportMemberController');
var PinApi = require('./controllers/v2/api/PinController');
var PinStockApi = require('./controllers/v2/api/PinStockController');
var PinOrderApi = require('./controllers/v2/api/PinOrderController');
var StockiestApi = require('./controllers/v2/api/StockiestController');
var BankApi = require('./controllers/v2/api/BankController');
var ProductApi = require('./controllers/v2/api/ProductController');
var ProductCategoryApi = require('./controllers/v2/api/ProductCategoryController');
var CartApi = require('./controllers/v2/api/CartController');
var OrderApi = require('./controllers/v2/api/OrderController');
var StockiestOrderApi = require('./controllers/v2/api/StockiestOrderController');
var WithdrawApi = require('./controllers/v2/api/WithdrawController');
var ReportApi = require('./controllers/v2/api/ReportController');
var ShipmentPriceApi = require('./controllers/v2/api/ShipmentPriceController');

var GenealogyApi = require('./controllers/v2/api/GenealogyController');
var BonusApi = require('./controllers/v2/api/BonusController');
var EwalletApi = require('./controllers/v2/api/EwalletController');
var TransactionHistoryApi = require('./controllers/v2/api/TransactionHistoryController');
var StockApi = require('./controllers/v2/api/StockController');

// Web Controllers

app.use('/member', MemberAreaController);
app.use('/shop', ShopAreaController);
app.use('/register', RegisterAreaController);
app.use('/', SiteAreaController);

// Api Controllers

app.use('/api/system', SystemController);
app.use('/api/account', AccountController);
app.use('/api/setting', SettingController);
app.use('/api/news', NewsController);
app.use('/api/page', PageController);
app.use('/api/banner', BannerController);
app.use('/api/images', ImageController);
app.use('/api/menu', MenuController);
app.use('/api/mailbox', MailboxController);
app.use('/api/bank', BankController);
app.use('/api/product', ProductController);
app.use('/api/product-category', ProductCategoryController);
app.use('/api/cart', CartController);
app.use('/api/order', OrderController);
app.use('/api/stockiest-order', StockiestOrderController);
app.use('/api/member', MemberController);
app.use('/api/import-member', ImportMemberController);
app.use('/api/pin', PinController);
app.use('/api/pin-stock', PinStockController);
app.use('/api/pin-order', PinOrderController);
app.use('/api/stockiest', StockiestController);
app.use('/api/withdraw', WithdrawController);

app.use('/api/report', ReportController);
app.use('/api/shipment-price', ShipmentPriceController);

// Api v2 Controllers

app.use('/api/v2/system', SystemApi);
app.use('/api/v2/account', AccountApi);
app.use('/api/v2/setting', SettingApi);
app.use('/api/v2/news', NewsApi);
app.use('/api/v2/page', PageApi);
app.use('/api/v2/banner', BannerApi);
app.use('/api/v2/images', ImageApi);
app.use('/api/v2/menu', MenuApi);
app.use('/api/v2/mailbox', MailboxApi);
app.use('/api/v2/bank', BankApi);
app.use('/api/v2/product', ProductApi);
app.use('/api/v2/product-category', ProductCategoryApi);
app.use('/api/v2/cart', CartApi);
app.use('/api/v2/order', OrderApi);
app.use('/api/v2/stockiest-order', StockiestOrderApi);
app.use('/api/v2/member', MemberApi);
app.use('/api/v2/import-member', ImportMemberApi);
app.use('/api/v2/pin', PinApi);
app.use('/api/v2/pin-stock', PinStockApi);
app.use('/api/v2/pin-order', PinOrderApi);
app.use('/api/v2/stockiest', StockiestApi);
app.use('/api/v2/withdraw', WithdrawApi);

app.use('/api/v2/report', ReportApi);
app.use('/api/v2/shipment-price', ShipmentPriceApi);

app.use('/api/v2/genealogy', GenealogyApi);
app.use('/api/v2/bonus', BonusApi);
app.use('/api/v2/ewallet', EwalletApi);
app.use('/api/v2/transaction-history', TransactionHistoryApi);
app.use('/api/v2/stock', StockApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('ErrorView');
});

module.exports = app;
