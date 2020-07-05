var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  postedOn: Date,
}, {
  collection: 'mailbox',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoose.model('Mailbox', Schema);
