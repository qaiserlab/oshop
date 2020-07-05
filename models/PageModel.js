var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  featuredImage: String,
  template: String,
  postedOn: Date,
  publication: String,
}, {
  collection: 'pages',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('permalink').get(function () {
  var permalink = '/' + this.slug;
  return permalink;
});

Schema.virtual('featuredImage_').get(function () {
  return '/writable/archives/' + this.featuredImage;
  // return 'http://cozmeedid.imgix.net/' + this.featuredImage;
});

mongoose.model('Page', Schema);
