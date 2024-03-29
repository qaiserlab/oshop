/************************
function definer()
************************/
var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();
var slugify = require('slugify');
var upload = require('../../helpers/upload');
var fs = require('fs');

var Model = mongoose.model('Product');
var StockModel = mongoose.model('Stock');

/************************
function find()
************************/
router.get('/find/:productId', (req, res, next) => {

  var productId = req.params.productId;
  Model.find({ productId: new RegExp('^' + productId, 'i') }).then(result => {

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
      });

  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

/************************
function findStock()
************************/
router.get('/find-stock/:memberId/:productId', (req, res, next) => {

  var memberId = req.params.memberId;
  var productId = req.params.productId;

  StockModel.find({ memberId }).populate('product').then(result_ => {

    var result = result_.map(row => row.product).reduce((rs, row) => {

      var available = rs.some(row_ => row.productId == row_.productId);
      if (!available) rs.push(row);

      return rs;
    }, []);

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
      });

  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

/************************
function search()
************************/
router.get('/search/:productId', (req, res, next) => {

  var productId = req.params.productId;
  Model.findOne({ productId }).then(result => {

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
      });

  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

/************************
function searchStock()
************************/
router.get('/search-stock/:memberId/:productId', (req, res, next) => {

  var memberId = req.params.memberId;
  var productId = req.params.productId;

  StockModel.find({ memberId }).populate('product').then(result_ => {
    var rsProduct = result_.reduce((rs, row) => {

      var i = -1;
      var position = 0;

      var found = rs.some(row_ => {
        i++;
        if (row_.productId == row.product.productId) {
          position = i;
          return true;
        }
      });

      if (!found) {
        var row_ = row.product;

        row_.in = 0;
        row_.out = 0;
        row_.balance = 0;
        row_.stockGroup = {};

        rs.push(row_);
        position = rs.length - 1;
      }

      rs[position].in += row.in;
      rs[position].out += row.out;
      rs[position].balance = rs[position].in - rs[position].out;

      rs[position].stockGroup[row.color] = rs[position].stockGroup[row.color] || {};
      rs[position].stockGroup[row.color][row.size] = rs[position].stockGroup[row.color][row.size] || {};
      rs[position].stockGroup[row.color][row.size].in = rs[position].stockGroup[row.color][row.size].in || 0;
      rs[position].stockGroup[row.color][row.size].in += row.in;
      rs[position].stockGroup[row.color][row.size].out = rs[position].stockGroup[row.color][row.size].out || 0;
      rs[position].stockGroup[row.color][row.size].out += row.out;
      rs[position].stockGroup[row.color][row.size].balance =
      rs[position].stockGroup[row.color][row.size].in - rs[position].stockGroup[row.color][row.size].out;

      return rs;
    }, []);

    var result = rsProduct.reduce((record, row) => {
      if (row.productId == productId) return row; else return record;
    }, {});

    var extra = {
      in: result.in,
      out: result.out,
      balance: result.balance,
      stockGroup: result.stockGroup,
    };

    if (result)
      res.json({
        state: 'success',
        message: 'Sukses, membaca data',
        data: result,
        extra,
      });
    else
      res.json({
        state: 'failed',
        message: 'Gagal, membaca data',
        data: error,
      });

  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

/************************
function get()
************************/
router.get('/', (req, res, next) => {
  var data = req.query;

  Model.find({}).then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membaca data',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membaca data',
      data: error,
    });
  });

});

async function validate(req, res, next) {
  var data = req.body;
  var errors = {};

  if (!data.productName)
    errors.productName = { message: 'Nama Produk belum diisi' };

  if (!data.productId)
    errors.productId = { message: 'ID Produk belum diisi' };

  // var rowProduct = await Model.findOne({ productId: data.productId });
  // if (rowProduct)
  //   errors.productId = { message: 'Sudah ada ID Produk yg sama' };

  if (!data.skuNumber)
    errors.skuNumber = { message: 'SKU Number belum diisi' };

  if (!data.weight)
    errors.weight = { message: 'Berat belum diisi' };

  if (!data.publication)
    errors.publication = { message: 'Status Publikasi belum diisi' };

  if (!data.productCategory.title)
    errors.productCategory = { message: 'Kategori belum diisi' };

  if (!data.featuredImage)
    errors.featuredImage = { message: 'Gambar belum diisi' };

  if (!data.prices[0].color)
    errors.color = { message: 'Warna belum diisi' };

  if (!data.prices[0].size)
    errors.size = { message: 'Ukuran belum diisi' };

  if (!data.prices[0].price)
    errors.price = { message: 'Harga belum diisi' };

  if (!data.description)
    errors.description = { message: 'Deskripsi belum diisi' };

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

  var productId = data.productId.trim();
  var skuNumber = data.skuNumber.trim();

  var productIndex = await Model.count({ productId: new RegExp('^' + productId, "i") });
  if (productIndex > 0) {
    productId += '-' + productIndex;
  }

  data.productId = productId;
  data.skuNumber = skuNumber;

  var slug = slugify(data.productName, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  var postedOn = Date.now();
  var productCategorySlug = slugify(data.productCategory.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });

  data.slug = slug;
  data.featuredImage = upload.save(data.featuredImage, data.slug);

  var i = 0;
  var imageName = '';

  data.images = data.images.map(image => {
    i++;
    imageName = data.slug + '-' + i;
    return upload.save(image, imageName);
  });

  data.postedOn = postedOn;
  data.productCategory.slug = productCategorySlug;

  var model = new Model(data);

  model.save().then(result => {
    res.json({
      state: 'success',
      message: 'Sukses, membuat data baru',
      data: result,
    });
  }).catch(error => {
    res.json({
      state: 'failed',
      message: 'Gagal, membuat data baru',
      data: error,
    });
  });

});

/************************
function put()
************************/
router.put('/:id', validate, (req, res, next) => {
  var id = req.params.id;
  var data = req.body;

  var productId = data.productId.trim();
  var skuNumber = data.skuNumber.trim();

  data.productId = productId;
  data.skuNumber = skuNumber;

  var slug = slugify(data.productName, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });

  data.slug = slug;
  data.featuredImage = upload.save(data.featuredImage, data.slug);

  var imageName = '';
  var i = 0;

  data.images = data.images.map(image => {
    i++;
    imageName = data.slug + '-' + image;

    if (!fs.existsSync('public/writable/archives/' + image))
      return upload.save(image, imageName);
    else
      return image;
  });

  var slug = slugify(data.productCategory.title, {
    replacement: '-',
    lower: true,
    remove: /[$*_+~.()'"!\-:@]/g,
  });
  data.productCategory.slug = slug;

  Model.findById(id).then(product => {
    var productId_ = product.productId;
    console.log('ID PRODUK:');
    console.log(productId_);
    StockModel.find({ productId: productId_ }).then(rsStock => {

      rsStock.forEach(stock => {

        stock.productId = data.productId;
        stock.save();
      });
    });
  });

  Model.findByIdAndUpdate(id, data).then(result => {

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

/************************
function delete()
************************/
router.delete('/:id', (req, res, next) => {
  var id = req.params.id;

  Model.findByIdAndRemove(id, (error, data) => {

    upload.remove(data.featuredImage);

    data.images.forEach(image => {
      upload.remove(image);
    });

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

module.exports = router;
