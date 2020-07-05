// var date = new Date();
// date.setMonth(date.getMonth() - 1);
// var year = date.getFullYear();
// var month = date.getMonth() + 1;

// const CronJob = require('cron').CronJob;

// console.log('Before job instantiation');
// const job = new CronJob('0 */1 * * * *', function() {
// 	const d = new Date();
// 	console.log('Every Tenth Minute:', d);
// });
// console.log('After job instantiation');
// job.start();

var mongoose = require('mongoose');

var Member = mongoose.model('Member');
var BonusPersonalSpending = mongoose.model('BonusPersonalSpending');

async function test() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	
	console.log(year);
	console.log(month);
	
	var members = await Member.find({});
}

test();

async function generatePersonalSpendingBonus() {
  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsSponsorMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 100,
    },
  });
  
  for (var rowSponsorMonthlyPv of rsSponsorMonthlyPv) {
    var rowSponsorXp = await MemberXpModel.findOne({ memberId: rowSponsorMonthlyPv.memberId });

    console.log('======================================================');
    console.log('SPONSOR: ' + rowSponsorMonthlyPv.memberId);
    console.log('PV: ' + rowSponsorMonthlyPv.personalPv);
    console.log('LEVEL: ' + rowSponsorXp.level.name);
    console.log('PSB: ' + rowSponsorXp.level.psb + '%');
    console.log('======================================================');
    
    // var rsMember = await MemberModel.find({ sponsorId: rowSponsorMonthlyPv.memberId });
    var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({ memberId: rowSponsorMonthlyPv.memberId });
    
    for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {

      if (rowMemberMonthlyPv.personalPv > 0) {
        var rowMember = await MemberModel.findOne({ memberId: rowMemberMonthlyPv.memberId });

        console.log('MEMBER ID: ' + rowMember.memberId);
        console.log('FULLNAME: ' + rowMember.fullName);
        console.log('PV: ' + rowMemberMonthlyPv.personalPv);
        
        var bonus = Math.round(
          rowMemberMonthlyPv.personalPv * (rowSponsorXp.level.psb/100) * 4500
        );
        
        console.log('BONUS: ' + bonus);
        console.log('------------------------------------------------------');

        var year = date.getFullYear();
        var month = date.getMonth() + 1;

        BonusPersonalSpendingModel.create({
          memberId: rowSponsorMonthlyPv.memberId,
          fromId: rowMember.memberId,
          fromName: rowMember.fullName,
          year,
          month,
          bonus,
        });

        EwalletModel.create({
          memberId: rowSponsorMonthlyPv.memberId,
          date,
          credit: bonus,
          debit: 0,
          saldo: 0,
          description: 'Personal Spending Bonus',
        });
      }

    }
  }
}
