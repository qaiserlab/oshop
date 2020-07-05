/************************
function definer()
************************/
var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();
var slugify = require('slugify');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

var ProductModel = mongoose.model('Product');
var StockModel = mongoose.model('Stock');

router.use(keyMiddleware);
router.use(authMiddleware);

/************************
function findByStockiest()
************************/
router.get('/find-by-stockiest', async (req, res, next) => {
  var stockiestId = req.query.stockiestId;
  var rsProduct = [];

  var rsStock = await StockModel.find({
    memberId: stockiestId,
  }).populate('product');

  rsStock.forEach(row => {

    foundIndex = -1; i = -1;

    found = rsProduct.some(row_ => {
      i++;
      if (row.product.productId == row_.product.productId &&
      row.color == row_.color &&
      row.size == row_.size) {
        foundIndex = i;
        return true;
      }
      else
        return false;
    });

    if (!row.product.productId)
      row.product_ = row.product.productName;
    else
      row.product_ = row.product.productId + '/' + row.product.productName;

    if (found) {
      rsProduct[foundIndex].in += row.in;
      rsProduct[foundIndex].out += row.out;
    }
    else {
      rsProduct.push(row);
    }

  });

  rsProduct.map(row => {
    row.balance = row.in - row.out;
    return row;
  });

  rsProduct.sort((r1, r2) => {
    return r2.balance - r1.balance;
  });

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProduct,
  });
});

/************************
function history()
************************/
router.get('/history', async (req, res, next) => {

  var from = req.query.from?new Date(req.query.from):new Date();
  if (!req.query.from) from.setMonth(from.getMonth() - 1);
  var to = req.query.to?new Date(req.query.to):new Date();

  var from_ = from.getFullYear() + '-' + (from.getMonth() + 1) + '-' + from.getDate();
  var to_ = to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate();

  to.setDate(to.getDate() + 1);

  var memberId = req.decoded.memberId;
  var rsStockBefore = await StockModel.find({
    memberId,
    date: {
      $lt: from,
    },
  }).populate('product');
  var rsStock = await StockModel.find({
    memberId,
    date: {
      $gte: from,
      $lt: to,
    },
  }, [], {
    sort: { date: 1 },
  }).populate('product');

  var rsStock_ = rsStock.reduce((rs, row) => {
    var found = false;

    if (rs[row.product.productId + row.color + row.size])
      found = rs[row.product.productId + row.color + row.size].rs.some(row_ =>
        row_.product.productId == row.product.productId &&
        row_.color == row.color &&
        row_.size == row.size
      );

    if (!found) {

      var balance = rsStockBefore.reduce((total, rowStockBefore) => {
        if (rowStockBefore.productId == row.product.productId &&
        rowStockBefore.color == row.color &&
        rowStockBefore.size == row.size)
          total += rowStockBefore.in - rowStockBefore.out;

        return total;
      }, 0);

      rs[row.product.productId + row.color + row.size] = {
        productId: row.product.productId,
        productName: row.product.productName,
        color: row.color,
        size: row.size,
        rs: [],
        balance,
      };
    }

    rs[row.product.productId + row.color + row.size].rs.push(row);

    return rs;
  }, {});

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsStock_,
  });
});

/************************
function total()
************************/
router.get('/total', async (req, res, next) => {
  var stockiestId = req.decoded.memberId;
  var rsProduct = [];

  if (stockiestId) {

    var rsStock = await StockModel.find({
      memberId: stockiestId,
    }).populate('product');

    rsStock.forEach(row => {

      foundIndex = -1; i = -1;

      found = rsProduct.some(row_ => {
        i++;
        if (row.product.productId == row_.product.productId &&
        row.color == row_.color &&
        row.size == row_.size) {
          foundIndex = i;
          return true;
        }
        else
          return false;
      });

      if (!row.product.productId)
        row.product_ = row.product.productName;
      else
        row.product_ = row.product.productId + '/' + row.product.productName;

      if (found) {
        rsProduct[foundIndex].in += row.in;
        rsProduct[foundIndex].out += row.out;
      }
      else {
        rsProduct.push(row);
      }

    });

    rsProduct.map(row => {
      row.balance = row.in - row.out;
      return row;
    });

    rsProduct.sort((r1, r2) => {
      return r2.balance - r1.balance;
    });

  }

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rsProduct,
  });
});

module.exports = router;
