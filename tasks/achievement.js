var mongoose = require('mongoose');
var loader = require('mongoose-model-loader');

var db = mongoose.connect('mongodb://127.0.0.1/oshop', {
  useMongoClient: true,
});
db.on('error', console.error.bind(console, 'Mongodb connection error:'));
db.once('open', function() {
  console.log("Mongodb connected!");
  loader(__dirname + '/../models');

  generateAchievementBonus();

  // mongoose.connection.close();
});

async function generateAchievementBonus() {
  var MemberModel = mongoose.model('Member');
  var MemberPvModel = mongoose.model('MemberPv');

  var rsMemberPv = await MemberPvModel.find().fill('rowMember');

  rsMemberPv.forEach(row => {
    console.log(row.rowMember.fullName);
  });

  // Reset Member XP

  // MemberXpModel.collection.drop(() => {
  //   MemberModel.find({}).then(rsMember => {
  //     var rsMemberXp = rsMember.map(row => {
  //       return {
  //         memberId: row.memberId,
  //         personalPv: 0,
  //         leftPv: 0,
  //         middlePv: 0,
  //         rightPv: 0,
  //         rangerUp: false,
  //         platinumRangerUp: false,
  //         ranger: {
  //           left: 0,
  //           middle: 0,
  //           right: 0,
  //         },
  //         platinumRanger: {
  //           left: 0,
  //           middle: 0,
  //           right: 0,
  //         },
  //       };
  //     });
  //
  //     MemberXpModel.create(rsMemberXp);
  //   });
  //
  // });
}
