var mongoose = require('mongoose');
var slugify = require('slugify');

var config = require('../config');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  title: String,
  slug: String,
  menu: Object,
}, {
  collection: 'menus',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoose.model('Menu', Schema);
