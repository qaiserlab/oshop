var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

var currencyFormatter = require('currency-formatter');

var OrderModel = mongoose.model('Order');
var ProductModel = mongoose.model('Product');
var CartModel = mongoose.model('Cart');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

router.use(keyMiddleware);

/************************
function get()
************************/
router.get('/', authMiddleware, (req, res, next) => {
  CartModel.find({ memberId: req.decoded.memberId }).then(rs => {
    res.json({
      state: 'success',
      message: 'Sukses, membaca data',
      data: rs,
    });
  });
});

/************************
function post()
************************/
router.post('/', authMiddleware, (req, res, next) => {
  var data = req.body;

  // var i = -1;
  // var found = false;
  //
  // req.session.cart.forEach(row => {
  //   i++;
  //
  //   if (row._id == data._id && row.selectedGroup.color == data.selectedGroup.color && row.selectedGroup.size == data.selectedGroup.size) {
  //     req.session.cart[i].qty = parseInt(req.session.cart[i].qty) + parseInt(data.qty);
  //     req.session.cart[i].selectedGroup.subTotal = parseInt(req.session.cart[i].qty) * parseInt(req.session.cart[i].selectedGroup.price);
  //     req.session.cart[i].selectedGroup.subTotal_ = currencyFormatter.format(req.session.cart[i].selectedGroup.subTotal, { code: 'IDR' });
  //
  //     // req.session.cart[i].point = parseInt(data.point) * req.session.cart[i].qty;
  //
  //     found = true;
  //   }
  // });
  //
  // if (!found) {
    data.selectedGroup.subTotal = parseInt(data.qty) * parseInt(data.selectedGroup.price);
    data.selectedGroup.subTotal_ = currencyFormatter.format(data.selectedGroup.subTotal, { code: 'IDR' });

    // data.point = parseInt(data.point) * data.qty;
    ProductModel.findOne({ productId: data.productId }).then(row => {

      row = row.toObject({ getters: true });

      row.memberId = req.decoded.memberId;
      // row.memberId = 'test';
      row.qty = data.qty;
      row.selectedGroup = data.selectedGroup;

      // req.session.cart.push(row);
      var cart = new CartModel(row);
      cart.save();

      var message = data.qty + ' ' + row.productName + ' telah ditambahkan ke Keranjang Belanja';
      res.json({
        state: 'success',
        message,
      });
    });
  // }
  // else {
  //   var message = data.qty + ' ' + data.productName + ' telah ditambahkan ke Keranjang Belanja';
  //
  //   res.json({
  //     state: 'success',
  //     message,
  //     data: req.session.cart,
  //   });
  // }
});

/************************
function put()
************************/
router.put('/', authMiddleware, async (req, res, next) => {
  var data = req.body;

  var rowCart = await CartModel.findById(data._id);

  data.selectedGroup.subTotal = parseInt(data.qty) * parseInt(data.selectedGroup.price);
  data.selectedGroup.subTotal_ = currencyFormatter.format(data.selectedGroup.subTotal, { code: 'IDR' });
  
  rowCart.qty = data.qty; 
  rowCart.selectedGroup = data.selectedGroup;
  rowCart.save();

  var message = 'Sukses, data telah diubah';
  res.json({
    state: 'success',
    message,
  });
});

/************************
function delete()
************************/
router.delete('/', authMiddleware, (req, res, next) => {
  var productId = req.body.productId;
  var color = req.body.color;
  var size = req.body.size;

  // req.session.cart = req.session.cart.filter(row => {
  //   return !(row._id == id && row.selectedGroup.color == color && row.selectedGroup.size == size);
  // });

  CartModel.findOneAndRemove({
    productId,
    'selectedGroup.color': color,
    'selectedGroup.size': size 
  }, (error, data) => {

    if (!error)
      res.json({
        state: 'success',
        message: 'Produk telah dihapus dari Keranjang Belanja',
        data,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, menghapus dari Keranjang Belanja',
        data: error,
      });
  });

  // res.json({
  //   state: 'success',
  //   message: 'Produk telah dihapus dari Keranjang Belanja',
  //   data: `productId: ${productId} / color: ${color} / size: ${size}`,
  // });
});

/************************
function patch()
************************/
router.patch('/', authMiddleware, (req, res, next) => {
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
