var mongoose = require('mongoose');
var slugify = require('slugify');
var striptags = require('striptags');

var upload = require('../helpers/upload');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  featuredImage: String,
  postedOn: Date,
  publication: String,
}, {
  collection: 'news',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('permalink').get(function () {

  var date = new Date(this.postedOn);
  var dateSlug = date.getFullYear() + "/" + (date.getMonth() + 1);
  var permalink = '/news/' + dateSlug + '/' + this.slug;

  return permalink;
});

Schema.virtual('featuredImage_').get(function () {
  return '/writable/archives/' + this.featuredImage;
  // return 'http://oshopid.imgix.net/' + this.featuredImage;
});

Schema.virtual('excerpt').get(function () {
  var range = 128;
  var content = striptags(this.content);

  if (content.length > range)
    var excerpt = content.substr(0, range);
  else
    var excerpt = content;

  return excerpt;
});

mongoose.model('News', Schema);
