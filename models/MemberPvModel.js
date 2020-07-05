var mongoose = require('mongoose-fill');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  date: Date,
  personalPv: Number,
  leftPv: Number,
  middlePv: Number,
  rightPv: Number,
}, {
  collection: 'member_pvs',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function fill()
*********************/

Schema.fill('rowMember', function (callback) {
  var MemberModel = mongoose.model('Member');
  MemberModel.findOne({ memberId: this.memberId }).exec(callback);
});

mongoose.model('MemberPv', Schema);
