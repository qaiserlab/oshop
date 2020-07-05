var mongoose = require('mongoose-fill');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  parent: String,
  title: String,
  slug: String,
  description: String,
  image: String,
  showOnHomepage: Boolean,
  publication: String,
}, {
  collection: 'products_categories',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function fill()
*********************/

Schema.fill('rsProduct', function (callback) {
  var ProductModel = mongoose.model('Product');
  var ProductCategoryModel = mongoose.model('ProductCategory');

  ProductCategoryModel.find({ parent: this.title }).exec((error, result) => {
    var slugs = [];

    result.forEach(row => {
      slugs.push(row.slug);
    });

    ProductModel.find({ 'productCategory.slug': { $in: slugs } }).limit(5).exec(callback);
  });
});

/*********************
function virtual()
*********************/

Schema.virtual('permalink').get(function () {
  return '/shop/' + this.slug;
});

Schema.virtual('image_').get(function () {
  // return '/writable/archives/' + this.image;
  return 'http://cozmeedid.imgix.net/' + this.image;
});

Schema.statics.findAllForHomepageAndPopulate = function (limit) {
  return new Promise((resolve, reject) => {

    this.find({ showOnHomepage: true, publication: 'Publish' }).fill('rsProduct').exec((error, result) => {
      if (!error)
        resolve(result);
      else
        reject(error);
    });

  });
};

mongoose.model('ProductCategory', Schema);
