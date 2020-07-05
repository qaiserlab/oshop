var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  title: String,
  image: String,
  content: String,
  url: String,
  postedOn: Date,
  publication: String,
}, {
  collection: 'banners',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('image_').get(function () {
  return '/writable/archives/' + this.image;
  // return 'http://cozmeedid.imgix.net/' + this.image;
});

mongoose.model('Banner', Schema);
