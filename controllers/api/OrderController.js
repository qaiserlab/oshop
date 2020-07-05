/************************
function definer()
************************/
var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var currencyFormatter = require('currency-formatter');

var encrypt = require('../../helpers/encrypt');
var messager = require('../../helpers/messager');

var Model = mongoose.model('Order');
var MemberXpModel = mongoose.model('MemberXp');
var MemberPvModel = mongoose.model('MemberPv');
var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');
var BonusDirectSellingModel = mongoose.model('BonusDirectSelling');
var BonusPointModel = mongoose.model('BonusPoint');
var EwalletModel = mongoose.model('Ewallet');
var StockModel = mongoose.model('Stock');
var MemberModel = mongoose.model('Member');
var ProductModel = mongoose.model('Product');
var StockiestOrderModel = mongoose.model('StockiestOrder');
var BankModel = mongoose.model('Bank');

/************************
function get()
************************/
router.get('/', (req, res, next) => {

  var rs = await Model.find({ stockiestId: '' }).limit(100);

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rs,
  });

  // var MongoClient = require('mongodb').MongoClient;
  // var url = 'mongodb+srv://qaiserdev:m30ngm30ngAA@cluster0-51geo.mongodb.net/db_marketplace?retryWrites=true&w=majority';

  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   console.log("Database connected using Native MongoDB driver!");

  //   db.collection("orders").find({ stockiestId: '' }).sort({orderDate: -1}).limit(500).toArray(function (err, data) {
  //     db.close();
  //     // console.log(data);

  //     res.json({
  //       state: 'success',
  //       message: 'Sukses, membaca data',
  //       data,
  //     });
  //   });

  // });
  
});

async function validateOrder(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.memberId)
    errors.memberId = { message: 'Username belum diisi' };
  if (!data.firstName)
    errors.firstName = { message: 'Nama Depan belum diisi' };
  if (!data.address)
    errors.address = { message: 'Alamat belum diisi' };
  if (!data.province)
    errors.province = { message: 'Propinsi belum diisi' };
  if (!data.city)
    errors.city = { message: 'Kota belum diisi' };
  if (!data.district)
    errors.district = { message: 'Kecamatan belum diisi' };
  if (!data.postalCode)
    errors.postalCode = { message: 'Kode Pos belum diisi' };
  if (!data.phoneNumber)
    errors.phoneNumber = { message: 'No. Telp belum diisi' };

  if (data.cart.length <= 0)
    errors.cart = { message: 'Keranjang Belanja belum diisi' };

  if (Object.keys(errors).length > 0)
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });
  else
    next();
}

/************************
function order()
************************/
router.post('/', validateOrder, async (req, res, next) => {
  var data = req.body;

  var code = encrypt.shortid();

  // var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });
  // var stockiest = rowStockiest._id;

  var orderDate = Date.now();
  var tomorrow = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Pending';

  data.code = encrypt.shortid();
  // data.stockiest = stockiest;
  data.orderDate = orderDate;
  data.dueDate = tomorrow;
  data.status = status;

  var rowMember = await MemberModel.findOne({ memberId: data.memberId });
  var memberName = rowMember.firstName + ' ' + rowMember.lastName;
  var email = rowMember.email;

  var orderList = `
  <table border="1">
  <thead>
  <tr>
    <th>Produk</th>
    <th>Warna</th>
    <th>Ukuran</th>
    <th>Qty</th>
  </tr>
  <thead><tbody>`;

  data.cart.forEach(async row => {
    var rowProduct = await ProductModel.findOne({ productId: row.productId });

    var productName = rowProduct.productName;
    var productId = rowProduct.productId;
    var color = row.selectedGroup.color;
    var size = row.selectedGroup.size;
    var price = row.selectedGroup.price_;
    var qty = row.qty;
    var subTotal = row.selectedGroup.subTotal_;

    var product = rowProduct._id;

    orderList += `
    <tr>
      <td>${productId} / ${productName}</td>
      <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
      <td>${size}</td>
      <td>${qty}</td>
    </tr>
    `;
  });

  var rsBank = await BankModel.find({});
  var bankList = '<ul>';

  rsBank.forEach(async row => {
    bankList += '<li>' +
      '<b>Bank:</b> ' + row.bank + '<br>' +
      '<b>No. Rekening:</b> ' + row.accountNumber + '<br>' +
      '<b>Atas Nama:</b> ' + row.accountName + '<br>&nbsp;' +
    '</li>';
  });

  bankList += '</ul>';

  Model.create(data, (error, data) => {
    if (!error) {

      req.session.cart = [];

      messager.sendMail(
        [email],
        'Oshop - Konfirmasi Pembayaran Invoice ' + data.code,
        'Pesanan Anda dengan nomor Invoice <b>' + data.code + '</b><br>' +
        'akan segera diproses setelah Anda melakukan pembayaran dan konfirmasi<br>' +
        'silakan membayar sebesar;<br><br>' +
        '<b>' + data.total_ + '</b><br><br>' +
        'ke salah satu dari rekening berikut;<br><br>' +
        bankList + '<br>' +
        'setelah membayar Anda dapat melakukan konfirmasi dengan meng-klik link berikut: <br><br>' +
        '<a href="http://oshop.id/shop/confirm-payment?code=' + data.code + '">KONFIRMASI PEMBAYARAN</a><br><br>'
        // 'Berikut data pesanan Anda;' +
        // orderList
      );
      // if (phoneNumber)
      //   messager.sendSms(phoneNumber,
      //   'Info Oshop, pesanan Anda telah diproses, cek email utk melihat list barang yg telah dikirim'
      // );

      res.json({
        state: 'success',
        message: 'Sukses, membuat data baru',
        data,
      });
    }
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membuat data baru',
        data: error,
      });
  });

});

async function validateMemberOrder(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.memberId)
    errors.memberId = { message: 'ID Member belum diisi' };

  if (data.cart.length <= 0)
    errors.cart = { message: 'Keranjang Belanja belum diisi' };

  if (Object.keys(errors).length > 0)
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });
  else
    next();
}

/************************
function memberOrder()
************************/
router.post('/member-order', validateMemberOrder, async (req, res, next) => {
  var data = req.body;

  var code = encrypt.shortid();

  var memberId = data.memberId;
  var rowMember = await MemberModel.findOne({ memberId });
  var memberName = rowMember.firstName + ' ' + rowMember.lastName;
  var firstName = rowMember.firstName;
  var lastName = rowMember.lastName;
  var email = rowMember.email;
  var phoneNumber = rowMember.phoneNumber;
  var address = rowMember.address;
  var province = rowMember.province;
  var city = rowMember.city;
  var district = rowMember.district;
  var postalCode = rowMember.postalCode;
  var dropship = { isDropship: false };

  var stockiestId = req.session.memberId;
  var rowStockiest = await MemberModel.findOne({ memberId: stockiestId });
  var stockiest = rowStockiest._id;

  var orderDate = Date.now();
  var tomorrow = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Pending';

  data.code = code;
  data.memberId = memberId;
  data.memberName = memberName;
  data.firstName = firstName;
  data.lastName = lastName;
  data.email = email;
  data.phoneNumber = phoneNumber;
  data.address = address;
  data.province = province;

  data.stockiestId = stockiestId;
  data.stockiest = stockiest;
  data.orderDate = orderDate;
  data.dueDate = tomorrow;
  data.status = status;

  Model.create(data, (error, data) => {
    if (!error) {
      req.session.cart = [];

      res.json({
        state: 'success',
        message: 'Sukses, membuat data baru',
        data,
      });
    }
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membuat data baru',
        data: error,
      });
  });

});

async function validateOrderStockiest(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.stockiestId)
    errors.stockiestId = { message: 'Stockiest ID belum diisi' };

  if (data.cart.length <= 0)
    errors.cart = { message: 'Keranjang belanja belum diisi' };

  if (Object.keys(errors).length > 0)
    res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });
  else
    next();
}

/************************
function orderStockiest()
************************/
router.post('/order-stockiest', validateOrderStockiest, async (req, res, next) => {
  var data = req.body;

  var code = encrypt.shortid();

  var memberId = req.session.memberId;
  var rowMember = await MemberModel.findOne({ memberId });
  var memberName = rowMember.firstName + ' ' + rowMember.lastName;
  var firstName = rowMember.firstName;
  var lastName = rowMember.lastName;
  var email = rowMember.email;
  var phoneNumber = rowMember.phoneNumber;
  var address = rowMember.address;
  var province = rowMember.province;
  var city = rowMember.city;
  var district = rowMember.district;
  var postalCode = rowMember.postalCode;
  var dropship = { isDropship: false };

  var stockiestId = data.stockiestId;
  var rowStockiest = await MemberModel.findOne({ memberId: stockiestId });
  var stockiest = rowStockiest._id;

  var orderDate = Date.now();
  var tomorrow = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Pending';

  data.code = code;
  data.memberId = memberId;
  data.memberName = memberName;
  data.firstName = firstName;
  data.lastName = lastName;
  data.email = email;
  data.phoneNumber = phoneNumber;
  data.address = address;
  data.province = province;

  // data.stockiestId = stockiestId;
  data.stockiest = stockiest;
  data.orderDate = orderDate;
  data.dueDate = tomorrow;
  data.status = status;

  Model.create(data, (error, data) => {
    if (!error) {
      var stockiestId = data.stockiestId;
      var date = Date.now();
      var ref = data.code;
      var description = 'Produk terjual';

      data.cart.forEach(async row => {

        var rowProduct = await ProductModel.findOne({ productId: row.productId });
  
        // var productName = rowProduct.productName;
        var productId = rowProduct.productId;
        var color = row.selectedGroup.color;
        var size = row.selectedGroup.size;
        // var price = row.selectedGroup.price_;
        // var qty = row.qty;
        // var subTotal = row.selectedGroup.subTotal_;
  
        var product = rowProduct._id;
        console.log('OK ---------------');
        console.log({
          memberId: stockiestId,
          date,
          ref,
          productId,
          color,
          size,
          product,
          description,
          'in': 0,
          'out': row.qty,
        });
        
        StockModel.create({
          memberId: stockiestId,
          date,
          ref,
          productId,
          color,
          size,
          product,
          description,
          'in': 0,
          'out': row.qty,
        });
      });

      req.session.cart = [];

      res.json({
        state: 'success',
        message: 'Sukses, membuat data baru',
        data,
      });
    }
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membuat data baru',
        data: error,
      });
  });

});

/************************
function confirm()
************************/
router.put('/confirm', async (req, res, next) => {
  var data = req.body;

  var errors = {};

  if (!data.code)
    errors.code = { message: `Kode Invoice belum diisi` };
  else {
    var found = await Model.count({ code: data.code });
    if (found <= 0)
      errors.code = { message: `Kode Invoice salah` };
  }

  if (!data.bankSender)
    errors.bankSender = { message: `Bank Pengirim belum diisi` };

  if (!data.fullName)
    errors.fullName = { message: `Nama Pemilik Rekening belum diisi` };

  if (!data.bankDestination)
    errors.bankDestination = { message: `Bank Tujuan belum diisi` };

  if (!data.amount)
    errors.amount = { message: `Jumlah Transfer belum diisi` };

  if (!data.confirmDate)
    errors.confirmDate = { message: `Tanggal belum diisi` };

  if (Object.keys(errors).length > 0)
    return res.json({
      state: 'invalid',
      message: 'Silakan perbaiki kesalahan berikut;',
      data: { errors },
    });

  var data_ = {
    confirm: data,
    status: 'Confirmed',
  };

  Model.findOneAndUpdate({ code: data.code }, data_, (error, data) => {

    if (!error) {
      res.json({
        state: 'success',
        message: 'Confirm data success',
      });
    }
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membuat data baru',
        data: error,
      });

  });

});

async function spreadPlatinumRanger(rowMember, rowMemberXp) {
  if (rowMemberXp.level.num >= 9) {
    if (!rowMemberXp.platinumRangerUp) {

      // Spreading

      var lastMemberId = rowMember.memberId;
      var rowUpline = await MemberModel.findOne({ memberId: rowMember.uplineId });
      var rowUplineXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });

      while(rowUpline) {

        if (rowUpline.leftFootId == lastMemberId) {
          rowUplineXp.platinumRanger.left++;
        }
        else if (rowUpline.middleFootId == lastMemberId) {
          rowUplineXp.platinumRanger.middle++;
        }
        else if (rowUpline.rightFootId == lastMemberId) {
          rowUplineXp.platinumRanger.right++;
        }

        rowUplineXp.save();

        lastMemberId = rowUpline.memberId;
        rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
        if (rowUpline)
          rowUplineXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });
      }

      // End Spreading

      rowMemberXp.platinumRangerUp = true;
      rowMemberXp.save();
    }
  }
}

async function spreadRanger(rowMember, rowMemberXp) {
  if (rowMemberXp.level.num >= 6 && rowMemberXp.level.num <= 8) {
    if (!rowMemberXp.rangerUp) {

      // Spreading

      var lastMemberId = rowMember.memberId;
      var rowUpline = await MemberModel.findOne({ memberId: rowMember.uplineId });
      var rowUplineXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });

      while(rowUpline) {

        if (rowUpline.leftFootId == lastMemberId) {
          rowUplineXp.ranger.left++;
        }
        else if (rowUpline.middleFootId == lastMemberId) {
          rowUplineXp.ranger.middle++;
        }
        else if (rowUpline.rightFootId == lastMemberId) {
          rowUplineXp.ranger.right++;
        }

        rowUplineXp.save();
        spreadPlatinumRanger(rowUpline, rowUplineXp);

        lastMemberId = rowUpline.memberId;
        rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
        if (rowUpline)
          rowUplineXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });
      }

      // End Spreading

      rowMemberXp.rangerUp = true;
      rowMemberXp.save();
    }
  }
}

async function addMemberPv(memberId, pv, position) {
  var date = Date.now();

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;

  var data = {
    memberId,
    date,
    personalPv: 0,
    leftPv: 0,
    middlePv: 0,
    rightPv: 0,
  };

  data[position + 'Pv'] = pv;
  MemberPvModel.create(data);

  var rowMemberMonthlyPv = await MemberMonthlyPvModel.findOne({
    memberId,
    year,
    month,
  });

  if (!rowMemberMonthlyPv) {
    data = {
      memberId,
      year,
      month,
      personalPv: 0,
      leftPv: 0,
      middlePv: 0,
      rightPv: 0,
    };
    data[position + 'Pv'] = pv;

    MemberMonthlyPvModel.create(data);
  }
  else {
    rowMemberMonthlyPv[position + 'Pv'] += pv;
    rowMemberMonthlyPv.save();
  }
}

/************************
function changeState()
************************/
router.put('/change-state/:code', async (req, res, next) => {
  var code = req.params.code;
  var data = req.body;
  var status = data.status;

  var rowOrder = await Model.findOne({ code });
  if (rowOrder.status == status)
    return res.json({
      state: 'failed',
      message: 'Terjadi double posting',
    });

  if (status == 'Delivered') {

    var errors = {};

    if (!data.resi)
      errors.resi = { message: 'No. Resi belum diisi' };

    if (Object.keys(errors).length > 0)
      return res.json({
        state: 'invalid',
        message: 'Silakan perbaiki kesalahan berikut;',
        data: { errors },
      });

    var rowOrderResi = await Model.findOne({ code });
    rowOrderResi.resi = data.resi;
    rowOrderResi.save();

    var orderList = `
    <table border="1">
    <thead>
    <tr>
      <th>Produk</th>
      <th>Warna</th>
      <th>Ukuran</th>
      <th>Qty</th>
    </tr>
    <thead><tbody>`;

    rowOrderResi.cart.forEach(async row => {

      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productName = rowProduct.productName;
      var productId = rowProduct.productId;
      var color = row.selectedGroup.color;
      var size = row.selectedGroup.size;
      var price = row.selectedGroup.price_;
      var qty = row.qty;
      var subTotal = row.selectedGroup.subTotal_;

      orderList += `
      <tr>
        <td>${productId} / ${productName}</td>
        <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
        <td>${size}</td>
        <td>${qty}</td>
      </tr>
      `;
    });
    var rowMember = await MemberModel.findOne({ memberId: rowOrderResi.memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;

    messager.sendMail(
      [email],
      'Oshop - Order Telah Dikirim',
      'Pesanan Anda telah dikirim dengan No. Resi ' + data.resi + '. ' +
      'Pesanan yg telah dikirim adalah dengan list pesanan sebagai berikut;' + orderList
    );

    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah dikirim dengan No. Resi ' + data.resi + ', cek email utk melihat list barang yg telah dikirim'
    );
  }

  var data = await Model.findOneAndUpdate({ code }, { status });

  if (status == 'Processed') {
    // Stock

    var orderList = `
    <table border="1">
    <thead>
    <tr>
      <th>Produk</th>
      <th>Warna</th>
      <th>Ukuran</th>
      <th>Qty</th>
    </tr>
    <thead><tbody>`;

    var memberId = req.session.memberId;
    var date = Date.now();
    var ref = data.code;
    var description = 'Produk terjual';
    var stockIn = 0;
    var stockOut = 0;

    data.cart.forEach(async row => {
      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productName = rowProduct.productName;
      var productId = rowProduct.productId;
      var color = row.selectedGroup.color;
      var size = row.selectedGroup.size;
      var price = row.selectedGroup.price_;
      var qty = row.qty;
      var subTotal = row.selectedGroup.subTotal_;

      var product = rowProduct._id;

      orderList += `
      <tr>
        <td>${productId} / ${productName}</td>
        <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
        <td>${size}</td>
        <td>${qty}</td>
      </tr>
      `;

      // StockModel.create({
      //   memberId,
      //   date,
      //   ref,
      //   productId,
      //   color,
      //   size,
      //   product,
      //   description,
      //   'in': stockIn,
      //   'out': row.qty,
      // });
    });

    // Bonus

    var total = 0;
    var pv = 0;

    data.cart.forEach(row => {
      total += parseInt(row.selectedGroup.subTotal);
      pv += (row.qty * row.point);
    });

    var bonus = total * (20/100);
    var date = Date.now();

    var rowMember = await MemberModel.findOne({ memberId: data.memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;
    var fullName = rowMember.firstName + ' ' + rowMember.lastName;
    var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });

    BonusDirectSellingModel.create({
      memberId: data.memberId,
      fromId: data.stockiestId,
      fromName: rowStockiest.fullName,
      date,
      total,
      bonus,
    });

    // PV

    // MemberPvModel.create({
    //   memberId: data.memberId,
    //   date,
    //   personalPv: pv,
    //   leftPv: 0,
    //   middlePv: 0,
    //   rightPv: 0,
    // });
    addMemberPv(data.memberId, pv, 'personal');

    BonusPointModel.create({
      memberId: data.memberId,
      fromId: data.stockiestId,
      fromName: rowStockiest.fullName,
      date,
      pv,
    });

    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });

    if (rowMemberXp) {
      rowMemberXp.personalPv += pv;
      await rowMemberXp.save();
    }
    else {
      await MemberXpModel.create({
        memberId: rowMember.memberId,
        personalPv: pv,
        leftPv: 0,
        middlePv: 0,
        rightPv: 0,
      });
      rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    }

    spreadRanger(rowMember, rowMemberXp);

    var lastMemberId = rowMember.memberId;
    var type = '';
    var rowUpline = await MemberModel.findOne({ memberId: rowMember.uplineId });

    while(rowUpline) {
      rowMemberXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });

      if (rowUpline.leftFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'left');

        if (rowMemberXp) {
          rowMemberXp.leftPv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: pv,
            middlePv: 0,
            rightPv: 0,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }
      else if (rowUpline.middleFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'middle');

        if (rowMemberXp) {
          rowMemberXp.middlePv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: 0,
            middlePv: pv,
            rightPv: 0,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }
      else if (rowUpline.rightFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'right');

        if (rowMemberXp) {
          rowMemberXp.rightPv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: 0,
            middlePv: 0,
            rightPv: pv,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }

      spreadRanger(rowMember, rowMemberXp);

      BonusPointModel.create({
        memberId: rowUpline.memberId,
        fromId: data.stockiestId,
        fromName: rowStockiest.fullName,
        date,
        pv,
      });

      lastMemberId = rowUpline.memberId;
      rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
    }

    // Ewallet

    EwalletModel.create({
      memberId: data.memberId,
      date,
      credit: bonus,
      debit: 0,
      saldo: 0,
      description: 'Insentif Penjualan Langsung',
    });

    messager.sendMail(
      [email],
      'Oshop - Order Telah Diproses',
      'Pesanan Anda telah diproses dengan list pesanan sebagai berikut;' + orderList
    );
    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah diproses, cek email utk melihat list barang yg telah diproses'
    );

  }

  res.json({
    state: 'success',
    message: 'Change state success',
    data,
  });
});

/************************
function delete()
************************/
router.delete('/:id', (req, res, next) => {
  var id = req.params.id;

  Model.findByIdAndRemove(id, (error, data) => {

    if (!error)
      res.json({
        state: 'success',
        message: 'Sukses, menghapus data',
        data,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, menghapus data',
        data: error,
      });
  });
});

/************************
function deleteStockiestOrder()
************************/
router.delete('/stockiest-order/:id', (req, res, next) => {
  var id = req.params.id;

  StockiestOrderModel.findByIdAndRemove(id, (error, data) => {

    if (!error)
      res.json({
        state: 'success',
        message: 'Sukses, menghapus data',
        data,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, menghapus data',
        data: error,
      });
  });
});

/************************
function state()
************************/
router.put('/state/:id', async (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  var status = data.status;

  var rowOrder = await Model.findById(id);
  var statusBefore = rowOrder.status;

  if (rowOrder.status == status)
    return res.json({
      state: 'failed',
      message: 'Terjadi double posting',
    });

  if (status == 'Delivered') {

    var errors = {};

    if (!data.resi)
      errors.resi = { message: 'No. Resi belum diisi' };

    if (Object.keys(errors).length > 0)
      return res.json({
        state: 'invalid',
        message: 'Silakan perbaiki kesalahan berikut;',
        data: { errors },
      });

    var rowOrderResi = await Model.findById(id);
    rowOrderResi.resi = data.resi;
    rowOrderResi.save();

    var orderList = `
    <table border="1">
    <thead>
    <tr>
      <th>Produk</th>
      <th>Warna</th>
      <th>Ukuran</th>
      <th>Qty</th>
    </tr>
    <thead><tbody>`;

    rowOrderResi.cart.forEach(async row => {

      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productName = rowProduct.productName;
      var productId = rowProduct.productId;
      var color = row.selectedGroup.color;
      var size = row.selectedGroup.size;
      var price = row.selectedGroup.price_;
      var qty = row.qty;
      var subTotal = row.selectedGroup.subTotal_;

      orderList += `
      <tr>
        <td>${productId} / ${productName}</td>
        <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
        <td>${size}</td>
        <td>${qty}</td>
      </tr>
      `;
    });
    var rowMember = await MemberModel.findOne({ memberId: rowOrderResi.memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;

    messager.sendMail(
      [email],
      'Oshop - Order Telah Dikirim',
      'Pesanan Anda telah dikirim dengan No. Resi ' + data.resi + '. ' +
      'Pesanan yg telah dikirim adalah dengan list pesanan sebagai berikut;' + orderList
    );

    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah dikirim dengan No. Resi ' + data.resi + ', cek email utk melihat list barang yg telah dikirim'
    );
  }

  var data_ = {
    status,
  };
  var data = await Model.findByIdAndUpdate(id, data_);

  if (status == 'Paid') {
    rowOrder.cart.forEach(async row => {
      await ProductModel.findOneAndUpdate({
        productId: row.productId,
        'prices.color': row.selectedGroup.color,
        'prices.size': row.selectedGroup.size,
      }, {
        $inc: { "prices.$.quantity": -(row.qty) },
      });

      await ProductModel.findOneAndUpdate({
        productId: row.productId,
        'prices.color': row.selectedGroup.color,
        'prices.size': row.selectedGroup.size,
        'prices.quantity': { $lt: 0 },
      }, {
        "prices.$.quantity": 0,
      });
    });
  }

  if (status == 'Processed') {
    
    var orderList = `
    <table border="1">
    <thead>
    <tr>
      <th>Produk</th>
      <th>Warna</th>
      <th>Ukuran</th>
      <th>Qty</th>
    </tr>
    <thead><tbody>`;

    var rowOrder = await Model.findById(id);
    if (rowOrder.uniqueCode) {
      EwalletModel.create({
        memberId: rowOrder.memberId,
        date: Date.now(),
        credit: rowOrder.uniqueCode,
        debit: 0,
        saldo: 0,
        description: 'Pengembalian Kode Unik pembelian',
      });
    }

    rowOrder.cart.forEach(async row => {

      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productName = rowProduct.productName;
      var productId = rowProduct.productId;
      var color = row.selectedGroup.color;
      var size = row.selectedGroup.size;
      var price = row.selectedGroup.price_;
      var qty = row.qty;
      var subTotal = row.selectedGroup.subTotal_;

      orderList += `
      <tr>
        <td>${productId} / ${productName}</td>
        <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
        <td>${size}</td>
        <td>${qty}</td>
      </tr>
      `;

      if (statusBefore == 'Pending' || statusBefore == 'Confirmed') {

        await ProductModel.findOneAndUpdate({
          productId: row.productId,
          'prices.color': row.selectedGroup.color,
          'prices.size': row.selectedGroup.size,
        }, {
          $inc: { "prices.$.quantity": -(row.qty) },
        });
  
        var test = await ProductModel.findOneAndUpdate({
          productId: row.productId,
          'prices.color': row.selectedGroup.color,
          'prices.size': row.selectedGroup.size,
          'prices.quantity': { $lt: 0 },
        }, {
          "prices.$.quantity": 0,
        });
      }


      // var rowProduct = await ProductModel.findOne({
      //   productId: row.productId,
      //   'prices.color': row.selectedGroup.color,
      //   'prices.size': row.selectedGroup.size,
      // });

      // rowProduct.prices.forEach(rowPrices => {
      // });

      // if (rowProduct) {

      //   var lastQty = rowProduct.prices[0].qty;
      //   rowProduct.prices[0].qty = lastQty - row.qty;

      //   await rowProduct.save();
      // }
    });

    // Bonus

    var total = 0;
    var pv = 0;

    data.cart.forEach(row => {
      total += parseInt(row.selectedGroup.subTotal);
      pv += (row.qty * row.point);
    });

    var bonus = total * (20/100);
    var date = Date.now();

    var rowMember = await MemberModel.findOne({ memberId: data.memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;
    var fullName = rowMember.firstName + ' ' + rowMember.lastName;

    var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });

    BonusDirectSellingModel.create({
      memberId: data.memberId,
      fromId: '-',
      fromName: 'Oshop',
      date,
      total,
      bonus,
    });

    // PV

    addMemberPv(data.memberId, pv, 'personal');

    BonusPointModel.create({
      memberId: data.memberId,
      fromId: '-',
      fromName: 'Oshop',
      date,
      pv,
    });

    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });

    if (rowMemberXp) {
      rowMemberXp.personalPv += pv;
      await rowMemberXp.save();
    }
    else {
      await MemberXpModel.create({
        memberId: rowMember.memberId,
        personalPv: pv,
        leftPv: 0,
        middlePv: 0,
        rightPv: 0,
      });
      rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    }

    spreadRanger(rowMember, rowMemberXp);

    var lastMemberId = rowMember.memberId;
    var type = '';
    var rowUpline = await MemberModel.findOne({ memberId: rowMember.uplineId });

    while(rowUpline) {
      rowMemberXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });

      if (rowUpline.leftFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'left');

        if (rowMemberXp) {
          rowMemberXp.leftPv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: pv,
            middlePv: 0,
            rightPv: 0,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }
      else if (rowUpline.middleFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'middle');

        if (rowMemberXp) {
          rowMemberXp.middlePv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: 0,
            middlePv: pv,
            rightPv: 0,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }
      else if (rowUpline.rightFootId == lastMemberId) {

        addMemberPv(rowUpline.memberId, pv, 'right');

        if (rowMemberXp) {
          rowMemberXp.rightPv += pv;
          await rowMemberXp.save();
        }
        else {
          await MemberXpModel.create({
            memberId: rowUpline.memberId,
            personalPv: 0,
            leftPv: 0,
            middlePv: 0,
            rightPv: pv,
          });
          rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
        }
      }

      spreadRanger(rowMember, rowMemberXp);

      BonusPointModel.create({
        memberId: rowUpline.memberId,
        fromId: '-',
        fromName: 'Oshop',
        date,
        pv,
      });

      lastMemberId = rowUpline.memberId;
      rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
    }

    // Ewallet

    EwalletModel.create({
      memberId: data.memberId,
      date,
      credit: bonus,
      debit: 0,
      saldo: 0,
      description: 'Insentif Penjualan Langsung',
    });

    messager.sendMail(
      [email],
      'Oshop - Order Telah Diproses',
      'Pesanan Anda telah diproses dengan list pesanan sebagai berikut;' + orderList
    );

    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah diproses, cek email utk melihat list barang yg telah diproses'
    );
  }

  res.json({
    state: 'success',
    message: 'Change state success',
    data,
  });

});

module.exports = router;
