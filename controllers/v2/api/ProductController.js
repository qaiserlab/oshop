/************************
function definer()
************************/
var mongoose = require('mongoose');

var express = require('express-await');
var router = express.Router();
var slugify = require('slugify');
var fs = require('fs');

var upload = require('../../../helpers/upload');

var keyMiddleware = require('../middleware/keyMiddleware');
var authMiddleware = require('../middleware/authMiddleware');

var Model = mongoose.model('Product');
var ProductCategory = mongoose.model('ProductCategory');
var StockModel = mongoose.model('Stock');

router.use(keyMiddleware);

/************************
function search()
************************/
router.get('/search', (req, res, next) => {

  var productName = req.query.productName;
  Model.find({ productName: new RegExp(productName, 'i') }).then(result => {

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
function find()
************************/
router.get('/find', (req, res, next) => {

  var productId = req.query.productId;
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
router.get('/find-stock', authMiddleware, (req, res, next) => {

  var memberId = req.query.memberId;
  var productId = req.query.productId;

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
function findOne()
************************/
router.get('/find-one', (req, res, next) => {

  var productId = req.query.productId;
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
function findOneStock()
************************/
router.get('/find-one-stock', authMiddleware, (req, res, next) => {

  var memberId = req.query.memberId;
  var productId = req.query.productId;

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
router.get('/', async (req, res, next) => {
  
  var categorySlug = req.query.categorySlug;
  var rs = [];

  // if (req.query.skip && req.query.range) {
    var skip = parseInt(req.query.skip);
    var range = parseInt(req.query.range);

    var condition = { publication: 'Publish' };
    
    if (categorySlug) {
      var rowProductCategory = await ProductCategory.findOne({ slug: categorySlug });
      
      if (rowProductCategory) {
        if (rowProductCategory.parent) {
          condition['productCategory.slug'] = categorySlug;
          console.log('slug: ' + categorySlug);
        }
        else {
          var rsSlugChild = await ProductCategory.find({ parent: rowProductCategory.title });
          
          var slugs = [];
          rsSlugChild.forEach(row => {
            slugs.push(row.slug);
          });
          
          condition['productCategory.slug'] = { $in: slugs };
        }
      }
    }
    rs = await Model.find(condition,  '', { skip, limit: range }).sort('-postedOn');
  // }
  // else {
  //   rs = await Model.find({});
  // }

  res.json({
    state: 'success',
    message: 'Sukses, membaca data',
    data: rs,
  });
});

/************************
function newProducts()
************************/
router.get('/new-products', (req, res, next) => {
  Model.find({
    newItem: true,
    publication: 'Publish'
  }).sort('-postedOn')
  .limit(15)
  .then(result => {
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

/************************
function bestSellers()
************************/
router.get('/best-sellers', (req, res, next) => {
  Model.find({
    bestSellerItem: true,
    publication: 'Publish'
  }).sort('-postedOn')
  .limit(15)
  .then(result => {
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
router.post('/', authMiddleware, validate, async (req, res, next) => {
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
router.put('/:id', authMiddleware, validate, (req, res, next) => {
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
router.delete('/:id', authMiddleware, (req, res, next) => {
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
