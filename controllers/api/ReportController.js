/************************
function definer()
************************/

var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var currencyFormatter = require('currency-formatter');

var MemberModel = mongoose.model('Member');
var StockiestOrderModel = mongoose.model('StockiestOrder');
var OrderModel = mongoose.model('Order');
var StockModel = mongoose.model('Stock');
var EwalletModel = mongoose.model('Ewallet');
var PinStockModel = mongoose.model('PinStock');

/************************
function getProductSales()
************************/
router.getAsync('/product-sales', async (req, res, next) => {

  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var rsOrder = await OrderModel.find({
    orderDate: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        productId: rowCart.productId,
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];
  var found, foundIndex, i;

  rsCart.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsProductSales.some(row_ => {
      i++;
      if (row.productId == row_.productId &&
        row.size == row_.size &&
        row.color == row_.color) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProductSales,
  });

});

/************************
function getStockiestProductStock()
************************/
router.getAsync('/stockiest-product-stock', async (req, res, next) => {

  var memberId = req.query.memberId;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var rsStock = await StockModel.find({
    memberId,
    date: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  }).populate('product');

  var rsStock_ = [];
  var found, foundIndex, i;

  rsStock.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsStock_.some(row_ => {
      i++;
      if (row.product.skuNumber == row_.product.skuNumber) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    row.product_ = row.product.skuNumber + '/' + row.product.productName;

    if (found) {
      rsStock_[foundIndex].in += row.in;
      rsStock_[foundIndex].out += row.out;
    }
    else {
      rsStock_.push(row);
    }

  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsStock_,
  });
});

/************************
function getStockiestSales()
************************/
router.getAsync('/stockiest-sales', async (req, res, next) => {

  var memberId = req.query.memberId;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var rsOrder = await OrderModel.find({
    stockiestId: memberId,
    orderDate: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        productId: rowCart.productId,
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];
  var found, foundIndex, i;

  rsCart.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsProductSales.some(row_ => {
      i++;
      if (row.productId == row_.productId &&
        row.size == row_.size &&
        row.color == row_.color) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProductSales,
  });
});

/************************
function getStockiestPurchase()
************************/
router.getAsync('/stockiest-purchase', async (req, res, next) => {

  var memberId = req.query.memberId;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var rsOrder = await StockiestOrderModel.find({
    memberId,
    orderDate: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        productId: rowCart.productId,
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.size,
        color: rowCart.color,
        price: rowCart.price,
        price_: currencyFormatter.format(rowCart.price, { code: 'IDR' }),
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];
  var found, foundIndex, i;

  rsCart.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsProductSales.some(row_ => {
      i++;
      if (row.productId == row_.productId &&
        row.size == row_.size &&
        row.color == row_.color) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProductSales,
  });
});

/************************
function getBestSellerProduct()
************************/
router.getAsync('/best-seller-product', async (req, res, next) => {

  var memberId = req.query.memberId;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var rsOrder = await OrderModel.find({
    // stockiestId: memberId,
    orderDate: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  });

  var rsCart = [];

  rsOrder.forEach(row => {
    row.cart.forEach(rowCart => {
      rsCart.push({
        productId: rowCart.productId,
        skuNumber: rowCart.skuNumber,
        productName: rowCart.productName,
        size: rowCart.selectedGroup.size,
        color: rowCart.selectedGroup.color,
        price: rowCart.selectedGroup.price,
        price_: rowCart.selectedGroup.price_,
        qty: rowCart.qty,
      });
    });
  });

  var rsProductSales = [];
  var found, foundIndex, i;

  rsCart.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsProductSales.some(row_ => {
      i++;
      if (row.productId == row_.productId &&
        row.size == row_.size &&
        row.color == row_.color) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    if (found) {
      rsProductSales[foundIndex].qty += row.qty;
    }
    else {
      rsProductSales.push(row);
    }

  });

  var total = 0;

  rsProductSales.map(row => {
    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    total += row.subTotal;

    return row;
  });

  total = currencyFormatter.format(total, { code: 'IDR' });

  // sorting

  rsProductSales.sort((current, row) => {
    return row.qty - current.qty;
  });

  var i = 0;
  rsProductSales.map(row => {

    i++;
    switch (i) {
      case 1:
        var rank = i + 'ST';
        break;
      case 2:
        var rank = i + 'ND';
        break;
      case 3:
        var rank = i + 'RD';
        break;
      default:
        var rank = i + 'TH';
    }
    row.rank = rank;

    row.subTotal = row.qty * row.price;
    row.subTotal_ = currencyFormatter.format(row.subTotal, { code: 'IDR' });

    // total += row.subTotal;

    return row;
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProductSales,
  });
});

/************************
function getTopBuyer()
************************/
router.getAsync('/top-buyer', async (req, res, next) => {
  var monthYear = req.query.monthYear;

  var xMonthYear = monthYear.split('-');
  var dMonthYear = new Date(xMonthYear[0], xMonthYear[1] - 1, xMonthYear[2]);
  var nextMonth  = dMonthYear.setMonth(dMonthYear.getMonth()+1);

  var rsOrder = await OrderModel.find({
    orderDate: {
      $lt: nextMonth,
    },
  });

  var rsTopBuyer = [];
  var no = 0;

  rsOrder.forEach(row => {
    no++;

    row.cart.forEach(row_ => {
      rsTopBuyer.push({
        no,
        memberId: row.memberId,
        fullName: row.firstName + ' ' + row.lastName,
        itemsAmount: row_.qty,
        shoppingAmount: (row_.qty * row_.selectedGroup.price),
      });
    });

  });

  var found;
  var rsTopBuyer_ = [];

  rsTopBuyer.forEach(row => {

  	found = rsTopBuyer_.some(row_ => row_.memberId == row.memberId);

    if (!found)
    	rsTopBuyer_.push(rsTopBuyer.filter(row_ => row_.memberId == row.memberId).reduce((r1, r2) => {
        r1.itemsAmount += r2.itemsAmount;
        r1.shoppingAmount += r2.shoppingAmount;
        return r1;
      }));
  });


  rsTopBuyer_.sort((r1, r2) => r2.shoppingAmount - r1.shoppingAmount);
  var i = 0;

  rsTopBuyer_ = rsTopBuyer_.map(row => {
    i++;

    row.no = i;
    row.shoppingAmount_ = currencyFormatter.format(row.shoppingAmount, { code: 'IDR' });
    return row;
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsTopBuyer_,
  });
});

/************************
function getTopReqruitment()
************************/
router.getAsync('/top-reqruitment', async (req, res, next) => {

  var monthYear = req.query.monthYear;

  var xMonthYear = monthYear.split('-');
  var dMonthYear = new Date(xMonthYear[0], xMonthYear[1] - 1, xMonthYear[2]);
  var nextMonth  = dMonthYear.setMonth(dMonthYear.getMonth()+1);

  var rsMember = await MemberModel.find({
    registeredOn: {
      $lt: nextMonth,
    },
  });

  var sponsoredMember;
  var i = 0;
  var rsTopReqruitment = [];

  rsMember.forEach(row => {
    i++;
    // sponsoredMember = await MemberModel.count({ sponsorId: row.memberId });
    sponsoredMember = 0;

    rsMember.forEach(row_ => {
      if (row_.sponsorId == row.memberId)
        sponsoredMember++;
    });

    rsTopReqruitment.push({
      no: i,
      memberId: row.memberId,
      fullName: row.fullName,
      sponsoredMember,
    });
  });

  rsTopReqruitment.sort((r1, r2) => {
    return r2.sponsoredMember - r1.sponsoredMember;
  });

  i = 0;
  var rsTopReqruitment_ = rsTopReqruitment.map(row => {
    i++; row.no = i;
    return row;
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsTopReqruitment_,
  });
});

/************************
function getBonusTransferHistory()
************************/
router.getAsync('/bonus-transfer-history', async (req, res, next) => {
  var memberId = req.query.memberId;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;

  var xFromDate = fromDate.split('-');
  var xToDate = toDate.split('-');

  var dFromDate = new Date(xFromDate[0], xFromDate[1] - 1, xFromDate[2]);
  var dToDate = new Date(xToDate[0], xToDate[1] - 1, xToDate[2]);
  dToDate.setDate(dToDate.getDate() + 1);

  var data = {
    date: {
      $gte: dFromDate,
      $lt: dToDate,
    },
  };

  if (memberId)
    data.memberId = memberId;

  var rsEwallet = await EwalletModel.find(data);

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsEwallet,
  });
});

/************************
function getSerialNumberStock()
************************/
router.getAsync('/serial-number-stock', async (req, res, next) => {
  var memberId = req.query.memberId;
  var monthYear = req.query.monthYear;

  var xMonthYear = monthYear.split('-');
  var dMonthYear = new Date(xMonthYear[0], xMonthYear[1] - 1, xMonthYear[2]);
  var nextMonth  = dMonthYear.setMonth(dMonthYear.getMonth()+1);

  var data = {
    date: {
      $lt: nextMonth,
    },
  };

  if (memberId)
    data.memberId = memberId;

  var rsPinStock = await PinStockModel.find(data).fill('rowMember');

  var found;
  var rsPinStock_ = [];

  rsPinStock.forEach(row => {

  	found = rsPinStock_.some(row_ => row_.memberId == row.memberId);

    if (!found) {
      data = rsPinStock.filter(row_ => row_.memberId == row.memberId).reduce((r1, r2) => {
        r1.in += r2.in;
        r1.out += r2.out;
        return r1;
      });

      data.balance = data.in - data.out;

      rsPinStock_.push(data);
    }
  });

  // rsPinStock_ = rsPinStock_.map(row => {
  //   row.fullName = row.rowMember.firstName;
  //   row.balance = row.in - row.out;
  //
  //   return row;
  // });


  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsPinStock_,
  });
});

module.exports = router;
