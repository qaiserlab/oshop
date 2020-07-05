var mongoose = require('mongoose-fill');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  year: Number,
  month: Number,
  personalPv: Number,
  leftPv: Number,
  middlePv: Number,
  rightPv: Number,
}, {
  collection: 'member_monthly_pvs',
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

mongoose.model('MemberMonthlyPv', Schema);
