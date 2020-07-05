var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

var currencyFormatter = require('currency-formatter');

var OrderModel = mongoose.model('Order');

/************************
function post()
************************/
router.post('/', (req, res, next) => {
  var data = req.body;

  var i = -1;
  var found = false;

  req.session.cart.forEach(row => {
    i++;

    if (row._id == data._id && row.selectedGroup.color == data.selectedGroup.color && row.selectedGroup.size == data.selectedGroup.size) {
      req.session.cart[i].qty = parseInt(req.session.cart[i].qty) + parseInt(data.qty);
      req.session.cart[i].selectedGroup.subTotal = parseInt(req.session.cart[i].qty) * parseInt(req.session.cart[i].selectedGroup.price);
      req.session.cart[i].selectedGroup.subTotal_ = currencyFormatter.format(req.session.cart[i].selectedGroup.subTotal, { code: 'IDR' });

      // req.session.cart[i].point = parseInt(data.point) * req.session.cart[i].qty;

      found = true;
    }
  });

  if (!found) {
    data.selectedGroup.subTotal = parseInt(data.qty) * parseInt(data.selectedGroup.price);
    data.selectedGroup.subTotal_ = currencyFormatter.format(data.selectedGroup.subTotal, { code: 'IDR' });

    // data.point = parseInt(data.point) * data.qty;

    req.session.cart.push(data);
  }

  var message = data.qty + ' ' + data.productName + ' telah ditambahkan ke Keranjang Belanja';

  res.json({
    state: 'success',
    message,
    data: req.session.cart,
  });
});

/************************
function delete()
************************/
router.delete('/:id/:color/:size', (req, res, next) => {
  var id = req.params.id;
  var color = req.params.color;
  var size = req.params.size;

  req.session.cart = req.session.cart.filter(row => {
    return !(row._id == id && row.selectedGroup.color == color && row.selectedGroup.size == size);
  });

  res.json({
    state: 'success',
    message: 'Produk telah dihapus dari Keranjang Belanja',
    data: req.session.cart,
  });
});

/************************
function patch()
************************/
router.patch('/', (req, res, next) => {
  var data = req.body;
  var cart = data.map(row => {

    row.selectedGroup.subTotal = parseInt(row.qty) * parseInt(row.selectedGroup.price);
    row.selectedGroup.subTotal_ = currencyFormatter.format(row.selectedGroup.subTotal, { code: 'IDR' });

    return row;
  });

  req.session.cart = cart;

  res.json({
    state: 'success',
    message: 'Berhasil me-reset Keranjang Belanja',
    data,
  });
});

module.exports = router;
