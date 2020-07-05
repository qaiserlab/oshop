var mongoose = require('mongoose');
var schedule = require('node-schedule');

var MemberModel = mongoose.model('Member');
var MemberXpModel = mongoose.model('MemberXp');
var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');
var SalaryModel = mongoose.model('Salary');
var StockiestModel = mongoose.model('Stockiest');
var EwalletModel = mongoose.model('Ewallet');
var BonusPersonalSpendingModel = mongoose.model('BonusPersonalSpending');
var BonusLeadershipModel = mongoose.model('BonusLeadership');
var BonusUnilevelModel = mongoose.model('BonusUnilevel');
var BonusPlatinumRangerModel = mongoose.model('BonusPlatinumRanger');
var IncentivePerformanceModel = mongoose.model('IncentivePerformance');
var IncentiveFunctionalModel = mongoose.model('IncentiveFunctional');
var IncentiveHomeCarOwnershipModel = mongoose.model('IncentiveHomeCarOwnership');
var IncentiveTravelAboardModel = mongoose.model('IncentiveTravelAboard');

async function generatePerformanceIncentives() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
	var year = date.getFullYear();
  var month = date.getMonth() + 1;

  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	// var rsSponsorMonthlyPv = await MemberMonthlyPvModel.find({
  //   year,
  //   month,
  //   personalPv: {
  //     $gte: 100,
  //   },
  // });

  var rsSponsor = await MemberModel.find({});

  for (var rowSponsor of rsSponsor) {
    console.log('- SPONSOR ID: ' + rowSponsor.memberId);

    var rsMember = await MemberModel.find({
      sponsorId: rowSponsor.memberId,
    });

    for (rowMember of rsMember) {
      var rowMemberMonthlyPv = await MemberMonthlyPvModel.findOne({ 
        memberId: rowMember.memberId, 
        year,
        month,
      });

      if (rowMemberMonthlyPv) {
        var incentive = 0;
        
        if (rowMemberMonthlyPv.personalPv > 0) {
          incentive = Math.round(
            (1.8/100) * (rowMemberMonthlyPv.personalPv * 25000)
          );
        }
        
        console.log('======================================================');
        console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
        console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv); 
        console.log('BONUS: ' + incentive);
        console.log('======================================================');
  
        if (incentive > 0) {

          var data = {
            memberId: rowSponsor.memberId,
            fromId: rowMemberMonthlyPv.memberId,
            fromName: rowMember.fullName,
            year,
            month,
            incentive,
          };
  
          var rowIncentivePerformance = await IncentivePerformanceModel.findOne(data);
          
          if (!rowIncentivePerformance) {
            IncentivePerformanceModel.create(data);
        
            EwalletModel.create({
              memberId: rowSponsor.memberId,
              date: now,
              credit: incentive,
              debit: 0,
              saldo: 0,
              description: 'Performance Incentives',
            });
          }

        }
      }

    }

  }
}

async function generatePersonalSpendingBonus() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 100,
    },
  });
  
  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    console.log('member id: '+rowMemberMonthlyPv.memberId+ ' year: '+rowMemberMonthlyPv.year+' month: '+rowMemberMonthlyPv.month)
    if (rowMemberXp) {
      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('PSB: ' + rowMemberXp.level.psb + '%');
      console.log('======================================================');

      var bonus = 0;
      
      if (rowMemberMonthlyPv.personalPv > 0 && rowMemberXp.level.psb > 0) {
        bonus = Math.round(
          (rowMemberXp.level.psb/100) * (rowMemberMonthlyPv.personalPv * 4500)
        );
      }

      if (bonus > 0) {

        var data = { 
          memberId: rowMemberMonthlyPv.memberId,
          year,
          month,
          bonus,
        };

        var rowBonusPersonalSpending = await BonusPersonalSpendingModel.findOne(data);
        
        if (!rowBonusPersonalSpending) {
          console.log('CREATE! ');
 
          BonusPersonalSpendingModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            year,
            month,
            bonus,
          });
      
          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: bonus,
            debit: 0,
            saldo: 0,
            description: 'Personal Spending Bonus',
          });
        }
      }
    }
   
  }
}

async function generateLeadershipBonus() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;

  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 60,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    console.log('- MEMBER ID: ' + rowMemberMonthlyPv.memberId);
    console.log('- PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    
    if (rowMemberXp) {
      var totalPv = 
      parseInt(rowMemberMonthlyPv.leftPv) +
      parseInt(rowMemberMonthlyPv.middlePv) +
      parseInt(rowMemberMonthlyPv.rightPv);

      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('TOTAL PV: ' + totalPv);

      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('LB: ' + rowMemberXp.level.lb + '%');
      console.log('======================================================');

      var bonus = 0;
      
      if (totalPv > 0 && rowMemberXp.level.lb > 0) {
        bonus = Math.round(
          ((rowMemberXp.level.lb/100) * (1.8/100)) * (totalPv * 25000)
        );
      }

      if (bonus > 0) {

        var data = {
          memberId: rowMemberMonthlyPv.memberId,
          year,
          month,
          bonus,
        };

        var rowBonusLeadership = await BonusLeadershipModel.findOne(data);
        
        if (!rowBonusLeadership) {
          BonusLeadershipModel.create(data);
      
          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: bonus,
            debit: 0,
            saldo: 0,
            description: 'Leadership Bonus',
          });
        }

      }
    }

  }
}

async function generateFunctionalIncentives() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 120,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {    
    // var rowStockiest = await StockiestModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    // if (rowStockiest) {
      var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
      
      if (rowMemberXp) {
        var totalPv = 
        parseInt(rowMemberMonthlyPv.leftPv) +
        parseInt(rowMemberMonthlyPv.middlePv) +
        parseInt(rowMemberMonthlyPv.rightPv);

        console.log('======================================================');
        console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
        console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
        console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
        console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
        console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
        console.log('TOTAL PV: ' + totalPv);

        console.log('LEVEL: ' + rowMemberXp.level.name);
        console.log('FI: ' + rowMemberXp.level.fi + '%');
        console.log('======================================================');

        var incentive = 0;
        
        if (totalPv > 0 && rowMemberXp.level.fi > 0) {
          incentive = Math.round(
            ((rowMemberXp.level.fi/100) * (1.8/100)) * (totalPv * 25000) 
          );
        }

        if (incentive > 0) {
          var data = {
            memberId: rowMemberMonthlyPv.memberId,
            year,
            month,
            incentive,
          };
  
          var rowIncentiveFunctional = await IncentiveFunctionalModel.findOne(data);
          
          if (!rowIncentiveFunctional) {
            IncentiveFunctionalModel.create(data);
      
            EwalletModel.create({
              memberId: rowMemberMonthlyPv.memberId,
              date: now,
              credit: incentive,
              debit: 0,
              saldo: 0,
              description: 'Functional Incentives',
            });
          }

        }
      }

    // }

  }
}

async function generateUnilevelBonus() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;

  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 120,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    console.log('- MEMBER ID: ' + rowMemberMonthlyPv.memberId);
    console.log('- PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    
    if (rowMemberXp) {
      var totalPv = 
      parseInt(rowMemberMonthlyPv.leftPv) +
      parseInt(rowMemberMonthlyPv.middlePv) +
      parseInt(rowMemberMonthlyPv.rightPv);

      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('TOTAL PV: ' + totalPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('======================================================');

      var bonus = 0;
      
      if (totalPv > 0) {
        bonus = Math.round(
          ((25000 * (4.5/100) / 9)) * totalPv
        );
      }

      if (bonus > 0) {

        var data = {
          memberId: rowMemberMonthlyPv.memberId,
          year,
          month,
          bonus,
        };
  
        var rowBonusUnilevel = await BonusUnilevelModel.findOne(data);
        
        if (!rowBonusUnilevel) {
          BonusUnilevelModel.create(data);
      
          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: bonus,
            debit: 0,
            saldo: 0,
            description: 'Unilevel Bonus',
          });
        }

      }
    }

  }
}

async function generateHomeCarOwnershipIncentives() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;

  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 120,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    console.log('- MEMBER ID: ' + rowMemberMonthlyPv.memberId);
    console.log('- PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });

    if (rowMemberXp && rowMemberXp.level.lvnum >= 8) {
      var totalPv = 
        parseInt(rowMemberMonthlyPv.leftPv) +
        parseInt(rowMemberMonthlyPv.middlePv) +
        parseInt(rowMemberMonthlyPv.rightPv);
  
      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('TOTAL PV: ' + totalPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('======================================================');
  
      var incentive = 0;
      
      if (totalPv > 0) {
        // incentive = Math.round(
        //   ((rowMemberXp.level.lb/100) * (1.8/100)) * (totalPv * 25000)
        // );
        // 25000 * (1/100) / 9 = 27.78
        incentive = Math.round(
          28 * totalPv
        );
      }
  
      if (incentive > 0) {
        console.log('NGISI: ' + rowMemberMonthlyPv.memberId);

        var data = {
          memberId: rowMemberMonthlyPv.memberId,
          year,
          month,
          incentive,
        };

        var rowIncentiveHomeCarOwnership = await IncentiveHomeCarOwnershipModel.findOne(data);
        
        if (!rowIncentiveHomeCarOwnership) {
          IncentiveHomeCarOwnershipModel.create(data);
      
          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: incentive,
            debit: 0,
            saldo: 0,
            description: 'Home/Car Ownership Incentives',
          });
        }

      }
    }

  }
}
async function generateTravelAboardIncentives() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;

  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    personalPv: {
      $gte: 120,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    console.log('- MEMBER ID: ' + rowMemberMonthlyPv.memberId);
    console.log('- PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });

    if (rowMemberXp && rowMemberXp.level.lvnum >= 8) {
      var totalPv = 
        parseInt(rowMemberMonthlyPv.leftPv) +
        parseInt(rowMemberMonthlyPv.middlePv) +
        parseInt(rowMemberMonthlyPv.rightPv);
  
      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('PERSONAL PV: ' + rowMemberMonthlyPv.personalPv);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('TOTAL PV: ' + totalPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('======================================================');
  
      var incentive = 0;
      
      if (totalPv > 0) {
        // 25000 * (0,5/100) / 9 = 14
        incentive = Math.round(
          14 * totalPv
        );
      }
  
      if (incentive > 0) {
        console.log('NGISI: ' + rowMemberMonthlyPv.memberId);

        var data = {
          memberId: rowMemberMonthlyPv.memberId,
          year,
          month,
          incentive,
        };

        var rowIncentiveTravelAboard = await IncentiveTravelAboardModel.findOne(data);
        
        if (!rowIncentiveTravelAboard) {
          IncentiveTravelAboardModel.create(data);

          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: incentive,
            debit: 0,
            saldo: 0,
            description: 'Travel Aboard Incentives',
          });
        }

      }
    }

  }
}

async function generatePlatinumRangerBonus() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    leftPv: {
      $gte: 120,
    },
    middlePv: {
      $gte: 120,
    },
    rightPv: {
      $gte: 120,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    if (rowMemberXp) {
      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('======================================================');

      var bonus = 523800; 

      // if (
      //   rowMemberXp.level.lvnum >= 13 &&
      //   rowMemberMonthlyPv.leftPv >= 14520 &&
      //   rowMemberMonthlyPv.middlePv >= 14520 &&
      //   rowMemberMonthlyPv.rightPv >= 14520
      // ) {
      //   bonus = 17000000;
      // }

      var data = {
        memberId: rowMemberMonthlyPv.memberId,
        year,
        month,
        bonus,
      };

      var rowBonusPlatinumRanger = await BonusPlatinumRangerModel.findOne(data);
      
      if (!rowBonusPlatinumRanger) {
        BonusPlatinumRangerModel.create(data);
    
        EwalletModel.create({
          memberId: rowMemberMonthlyPv.memberId,
          date: now,
          credit: bonus,
          debit: 0,
          saldo: 0,
          description: 'Platinum Ranger Bonus',
        });
      }

    }

  }
}

async function generateSalaries() {
  var now = new Date();

  var date = new Date();
  date.setMonth(date.getMonth() - 1);
  
	var year = date.getFullYear();
  var month = date.getMonth() + 1;
  
  console.log('YEAR: ' + year + ' MONTH: ' + month);
	
	var rsMemberMonthlyPv = await MemberMonthlyPvModel.find({
    year,
    month,
    leftPv: {
      $gte: 480,
    },
    middlePv: {
      $gte: 480,
    },
    rightPv: {
      $gte: 480,
    },
  }); 

  for (var rowMemberMonthlyPv of rsMemberMonthlyPv) {
    
    var rowMemberXp = await MemberXpModel.findOne({ memberId: rowMemberMonthlyPv.memberId });
    if (rowMemberXp) {
      var totalPv = 
      parseInt(rowMemberMonthlyPv.leftPv) +
      parseInt(rowMemberMonthlyPv.middlePv) +
      parseInt(rowMemberMonthlyPv.rightPv);

      console.log('======================================================');
      console.log('MEMBER ID: ' + rowMemberMonthlyPv.memberId);
      console.log('LEFT PV: ' + rowMemberMonthlyPv.leftPv);
      console.log('MIDDLE PV: ' + rowMemberMonthlyPv.middlePv);
      console.log('RIGHT PV: ' + rowMemberMonthlyPv.rightPv);
      console.log('LEVEL: ' + rowMemberXp.level.name);
      console.log('======================================================');

      var salary = 0; 

      if (
        rowMemberXp.level.lvnum >= 4 &&
        rowMemberMonthlyPv.leftPv >= 480 &&
        rowMemberMonthlyPv.middlePv >= 480 &&
        rowMemberMonthlyPv.rightPv >= 480
      ) {
        salary = 1000000;
      }

      if (
        rowMemberXp.level.lvnum >= 9 &&
        rowMemberMonthlyPv.leftPv >= 1560 &&
        rowMemberMonthlyPv.middlePv >= 1560 &&
        rowMemberMonthlyPv.rightPv >= 1560
      ) {
        salary = 3000000;
      }

      if (
        rowMemberXp.level.lvnum >= 12 &&
        rowMemberMonthlyPv.leftPv >= 4800 &&
        rowMemberMonthlyPv.middlePv >= 4800 &&
        rowMemberMonthlyPv.rightPv >= 4800
      ) {
        salary = 8000000;
      }
      
      if (
        rowMemberXp.level.lvnum >= 13 &&
        rowMemberMonthlyPv.leftPv >= 14520 &&
        rowMemberMonthlyPv.middlePv >= 14520 &&
        rowMemberMonthlyPv.rightPv >= 14520
      ) {
        salary = 17000000;
      }

      if (
        rowMemberXp.level.lvnum >= 14 &&
        rowMemberMonthlyPv.leftPv >= 43680 &&
        rowMemberMonthlyPv.middlePv >= 43680 &&
        rowMemberMonthlyPv.rightPv >= 43680
      ) {
        salary = 40000000;
      }

      if (salary > 0) {

        var data = {
          memberId: rowMemberMonthlyPv.memberId,
          levelName: rowMemberXp.level.name,
          year,
          month,
          salary,
        };
  
        var rowSalary = await SalaryModel.findOne(data);
        
        if (!rowSalary) {
          SalaryModel.create(data);
      
          EwalletModel.create({
            memberId: rowMemberMonthlyPv.memberId,
            date: now,
            credit: salary,
            debit: 0,
            saldo: 0,
            description: 'Salary',
          });
        }

        // description: 'Salary (' + rowMemberXp.level.name + ')',
      }
    }

  }
}

schedule.scheduleJob('0 0 1 * *', generatePersonalSpendingBonus);
schedule.scheduleJob('0 0 1 * *', generateLeadershipBonus);
schedule.scheduleJob('0 0 1 * *', generateUnilevelBonus);
schedule.scheduleJob('0 0 1 * *', generatePlatinumRangerBonus);
schedule.scheduleJob('0 0 1 * *', generateFunctionalIncentives);
schedule.scheduleJob('0 0 1 * *', generatePerformanceIncentives);
schedule.scheduleJob('0 0 1 * *', generateHomeCarOwnershipIncentives);
schedule.scheduleJob('0 0 1 * *', generateTravelAboardIncentives);
schedule.scheduleJob('0 0 1 * *', generateSalaries);
