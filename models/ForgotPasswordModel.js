var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  code: String,
  memberId: String,
  email: String,
  postedOn: Date,
  dueDate: Date,
  status: String,
}, {
  collection: 'forgot_passwords',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoose.model('ForgotPassword', Schema);
