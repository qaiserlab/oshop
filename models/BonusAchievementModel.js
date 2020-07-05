var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  fromId: String,
  fromName: String,
  year: Number,
  month: Number,
  bonus: Number,
}, {
  collection: 'bonus_achievements',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoose.model('BonusAchievement', Schema);
