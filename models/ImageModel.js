var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  title: String,
  slug: String,
  image: String,
  content: String,
  url: String,
  postedOn: Date,
  publication: String,
}, {
  collection: 'images',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('image_').get(function () {
  return '/writable/archives/' + this.image;
  // return 'http://oshopid.imgix.net/' + this.image;
});

Schema.virtual('url_').get(function () {
  return this.url?this.url:'javascript:';
});

mongoose.model('Image', Schema);
