/************************
function definer()
************************/
var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();

var encrypt = require('../../helpers/encrypt');
var messager = require('../../helpers/messager');

var Model = mongoose.model('StockiestOrder');
var StockModel = mongoose.model('Stock');
var ProductModel = mongoose.model('Product');
var MemberModel = mongoose.model('Member');
var BonusDirectSellingModel = mongoose.model('BonusDirectSelling');
var BonusPointModel = mongoose.model('BonusPoint');
var MemberXpModel = mongoose.model('MemberXp');
var EwalletModel = mongoose.model('Ewallet');
var MemberPvModel = mongoose.model('MemberPv');
var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');

/************************
function get()
************************/
router.get('/', (req, res, next) => {

  Model.find({}).populate('member').then(data => {
    res.json({
      state: 'success',
      message: 'Sukses, membaca data',
      data,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (data.cart.length <= 0)
    errors.cart = { message: 'Keranjang belanja masih kosong' };

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
function post()
************************/
router.post('/', validate, async (req, res, next) => {
  var data = req.body;

  var code = encrypt.shortid();
  var memberId = req.session.memberId;
  var member = req.session.userId;
  var orderDate = Date.now();
  var tomorrow = new Date(Date.now() + 1 * 24 * 3600 * 1000);
  var status = 'Pending';

  data.code = encrypt.shortid();
  data.memberId = memberId;
  data.member = member;
  data.orderDate = orderDate;
  data.dueDate = tomorrow;
  data.status = status;

  var model = new Model(data);

  model.save().then(result => {
    res.json({
      state: 'success',
      message: 'Order success',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Order failed',
      data: error,
    });
  });

});

/************************
function put()
************************/
router.put('/:id', (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  // var slug = slugify(data.title, {
  //   replacement: '-',
  //   lower: true,
  //   remove: /[$*_+~.()'"!\-:@]/g,
  // });
  // var featuredImage = upload.save(data.featuredImage, slug);
  //
  // data.slug = slug;
  // data.featuredImage = featuredImage;

  Model.findByIdAndUpdate(id, { cart: data.cart }).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, mengubah data',
      data,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, mengubah data',
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
function state()
************************/
router.put('/state/:id', async (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  var status = data.status;

  var rowOrder = await Model.findById(id);
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

    var rowMember = await MemberModel.findOne({ memberId: rowOrderResi.memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;

    messager.sendMail(
      [email],
      'Oshop - Order Telah Dikirim',
      'Pesanan Anda telah dikirim dengan No. Resi ' + data.resi
    );

    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah dikirim dengan No. Resi ' + data.resi
    );
  }

  var data_ = {
    status,
  };

  var rowOrder = await Model.findByIdAndUpdate(id, data_);
  var data = rowOrder;

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

    // Stock out on Oshop

    var rowOrder = await Model.findById(id);

    rowOrder.cart.forEach(async row => {

      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productName = rowProduct.productName;
      var productId = rowProduct.productId;
      var color = row.color;
      var size = row.size;
      var price = row.price_;
      var qty = row.qty;
      var subTotal = row.subTotal_;

      orderList += `
      <tr>
        <td>${productId} / ${productName}</td>
        <td><div style="background: ${color}; width: 24px; height: 24px"></div></td>
        <td>${size}</td>
        <td>${qty}</td>
      </tr>
      `;

      await ProductModel.findOneAndUpdate({
        productId: row.productId,
        'prices.color': row.color,
        'prices.size': row.size,
      }, {
        $inc: { "prices.$.quantity": -(row.qty) },
      });

      await ProductModel.findOneAndUpdate({
        productId: row.productId,
        'prices.color': row.color,
        'prices.size': row.size,
        'prices.quantity': { $lt: 0 },
      }, {
        "prices.$.quantity": 0,
      });
    });

    // Stock

    var memberId = rowOrder.memberId;
    var date = Date.now();
    var ref = rowOrder.code;
    var description = 'Stock order';
    var stockOut = 0;

    rowOrder.cart.forEach(async row => {
      var rowProduct = await ProductModel.findOne({ productId: row.productId });

      var productId = rowProduct.productId;
      var color = row.color;
      var size = row.size;

      var product = rowProduct._id;

      StockModel.create({
        memberId,
        date,
        ref,

        productId,
        color,
        size,

        product,
        description,
        'in': row.qty,
        'out': stockOut,
      });
    });

    // Bonus

    // var total = 0;
    // var pv = 0;
    //
    // data.cart.forEach(row => {
    //   total += parseInt(row.subTotal);
    //   pv += (row.qty * row.point);
    // });
    //
    // var bonus = total * (20/100);
    // var date = Date.now();
    //
    // var rowMember = await MemberModel.findOne({ memberId: data.memberId });
    // var rowStockiest = await MemberModel.findOne({ memberId: data.stockiestId });
    //
    // BonusDirectSellingModel.create({
    //   memberId: data.memberId,
    //   fromId: '-',
    //   fromName: 'Oshop',
    //   date,
    //   total,
    //   bonus,
    // });

    // PV

    // addMemberPv(data.memberId, pv, 'personal');
    //
    // BonusPointModel.create({
    //   memberId: data.memberId,
    //   fromId: '-',
    //   fromName: 'Oshop',
    //   date,
    //   pv,
    // });
    //
    // var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    //
    // if (rowMemberXp) {
    //   rowMemberXp.personalPv += pv;
    //   await rowMemberXp.save();
    // }
    // else {
    //   await MemberXpModel.create({
    //     memberId: rowMember.memberId,
    //     personalPv: pv,
    //     leftPv: 0,
    //     middlePv: 0,
    //     rightPv: 0,
    //   });
    //   rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    // }
    //
    // spreadRanger(rowMember, rowMemberXp);
    //
    // var lastMemberId = rowMember.memberId;
    // var type = '';
    // var rowUpline = await MemberModel.findOne({ memberId: rowMember.uplineId });
    //
    // while(rowUpline) {
    //   rowMemberXp = await MemberXpModel.findOne({ memberId: rowUpline.memberId });
    //
    //   if (rowUpline.leftFootId == lastMemberId) {
    //
    //     addMemberPv(rowUpline.memberId, pv, 'left');
    //
    //     if (rowMemberXp) {
    //       rowMemberXp.leftPv += pv;
    //       await rowMemberXp.save();
    //     }
    //     else {
    //       await MemberXpModel.create({
    //         memberId: rowUpline.memberId,
    //         personalPv: 0,
    //         leftPv: pv,
    //         middlePv: 0,
    //         rightPv: 0,
    //       });
    //       rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    //     }
    //   }
    //   else if (rowUpline.middleFootId == lastMemberId) {
    //
    //     addMemberPv(rowUpline.memberId, pv, 'middle');
    //
    //     if (rowMemberXp) {
    //       rowMemberXp.middlePv += pv;
    //       await rowMemberXp.save();
    //     }
    //     else {
    //       await MemberXpModel.create({
    //         memberId: rowUpline.memberId,
    //         personalPv: 0,
    //         leftPv: 0,
    //         middlePv: pv,
    //         rightPv: 0,
    //       });
    //       rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    //     }
    //   }
    //   else if (rowUpline.rightFootId == lastMemberId) {
    //
    //     addMemberPv(rowUpline.memberId, pv, 'right');
    //
    //     if (rowMemberXp) {
    //       rowMemberXp.rightPv += pv;
    //       await rowMemberXp.save();
    //     }
    //     else {
    //       await MemberXpModel.create({
    //         memberId: rowUpline.memberId,
    //         personalPv: 0,
    //         leftPv: 0,
    //         middlePv: 0,
    //         rightPv: pv,
    //       });
    //       rowMemberXp = await MemberXpModel.findOne({ memberId: rowMember.memberId });
    //     }
    //   }
    //
    //   spreadRanger(rowMember, rowMemberXp);
    //
    //   BonusPointModel.create({
    //     memberId: rowUpline.memberId,
    //     fromId: '-',
    //     fromName: 'Oshop',
    //     date,
    //     pv,
    //   });
    //
    //   lastMemberId = rowUpline.memberId;
    //   rowUpline = await MemberModel.findOne({ memberId: rowUpline.uplineId });
    // }

    // Ewallet

    // EwalletModel.create({
    //   memberId: data.memberId,
    //   date,
    //   credit: bonus,
    //   debit: 0,
    //   saldo: 0,
    //   description: 'Insentif Penjualan Langsung',
    // });

    var rowMember = await MemberModel.findOne({ memberId });
    var email = rowMember.email;
    var phoneNumber = rowMember.phoneNumber;
    var fullName = rowMember.firstName + ' ' + rowMember.lastName;

    messager.sendMail(
      [email],
      'Oshop - Order Telah Diproses',
      'Pesanan Anda telah diproses dengan list pesanan sebagai berikut;' + orderList
    );
    if (phoneNumber)
      messager.sendSms(phoneNumber,
      'Info Oshop, pesanan Anda telah diproses, cek email utk melihat list barang yg telah dikirim'
    );
  }

  res.json({
    state: 'success',
    message: 'Change state success',
    data,
  });

});

module.exports = router;
