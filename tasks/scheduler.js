var mongoose = require('mongoose');
var loader = require('mongoose-model-loader');
var schedule = require('node-schedule');

var db = mongoose.connect('mongodb://127.0.0.1/oshop', {
});
db.on('error', console.error.bind(console, 'Mongodb connection error:'));
db.once('open', function() {
  console.log("Mongodb connected!");
  loader(__dirname + '/../models');

  generateAchievementBonus();
});

async function generateAchievementBonus() {
  var bonus = 0;

  var BonusAchievementModel = mongoose.model('BonusAchievement');
  var MemberModel = mongoose.model('Member');
  var MemberPvModel = mongoose.model('MemberPv');
  var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
  }).fill('rowMember');

  rsMemberMonthlyPv.forEach(row => {
    if(row.personalPv > 0) {
      bonus = (row.personalPv * 0.1) * 4500;

      BonusAchievementModel.create({
        memberId: row.rowMember.sponsorId,
        fromId: row.rowMember.memberId,
        fromName: row.rowMember.fullName,
        year,
        month,
        bonus,
      })
    }
  });
}

// schedule.scheduleJob('50 * * * *', generateAchievementBonus);
