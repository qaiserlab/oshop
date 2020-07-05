var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var DownlineCounterSchema = mongoose.Schema({
  left: Number,
  middle: Number,
  right: Number,
});

var Schema = mongoose.Schema({
  memberId: String,
  personalPv: Number,
  leftPv: Number,
  middlePv: Number,
  rightPv: Number,

  rangerUp: Boolean,
  platinumRangerUp: Boolean,
  ranger: DownlineCounterSchema,
  platinumRanger: DownlineCounterSchema,

}, {
  collection: 'member_xps',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

Schema.virtual('totalPv').get(function () {
  return this.personalPv + this.leftPv + this.middlePv + this.rightPv;
});

Schema.virtual('level').get(function () {
  // Peringkat 1 PERINTIS
  // √ NEW BROTHERHOOD
  // √ SENIOR BROTHERHOOD
  // √ SUPERVISOR
  // √ MANAGER
  // √ SENIOR MANAGER
  //
  // Peringkat 2 MENENGAH
  // √ SILVER MNGER
  // √ RUBY MNGER
  // √ EMERALD MNGER
  //
  // Peringkat 3 ATAS
  // √ GOLD MNGER
  // √ DIAMOND MNGER
  // √ PLATINUM MNGER
  //
  // Peringkat 4 TOP
  // √ CROWN MNGER
  // √ ROYAL CROWN
  // √ ROYAL PRESIDENT
  //
  // Sebutan RANGER dipakai PANGGILAN semua member
  //
  // Sebutan NAMA GUNUNG dipakai LEADERS CLUB & KOMUNITAS BERGENSI

  var rsLevel = [
    { lvnum: 1, num: 1, name: 'NEW BROTHERHOOD', psb: 3, lb: 0, fi: 0 },
    { lvnum: 2, num: 1, name: 'SENIOR BROTHERHOOD', psb: 5, lb: 10, fi: 20 },
    { lvnum: 3, num: 1, name: 'SUPERVISOR', psb: 7, lb: 10, fi: 0 },
    { lvnum: 4, num: 1, name: 'ASISTEN MANAGER', psb: 9, lb: 10, fi: 0 },
    { lvnum: 5, num: 1, name: 'MANAGER', psb: 11, lb: 10, fi: 10 },
    { lvnum: 6, num: 1, name: 'BRANCH MANAGER', psb: 13, lb: 7, fi: 10 },
    { lvnum: 7, num: 2, name: 'SILVER MANAGER', psb: 15, lb: 7, fi: 10 },
    { lvnum: 8, num: 2, name: 'GOLD MANAGER', psb: 17, lb: 7, fi: 10 },
    { lvnum: 9, num: 3, name: 'RUBY MANAGER', psb: 19, lb: 5, fi: 8 },
    { lvnum: 10, num: 3, name: 'EMERALD MANAGER', psb: 19, lb: 5, fi: 8 },
    { lvnum: 11, num: 3, name: 'DIAMOND MANAGER', psb: 19, lb: 5, fi: 8 },
    { lvnum: 12, num: 4, name: 'CROWN MANAGER', psb: 20, lb: 3, fi: 6 },
    { lvnum: 13, num: 4, name: 'ROYAL CROWN', psb: 20, lb: 3, fi: 6 },
    { lvnum: 14, num: 4, name: 'ROYAL PRESIDENT', psb: 20, lb: 3, fi: 6 },
    // { num: 1, name: 'SENIOR MANAGER', psb: 15, lb: 0, fi: 0 },
    // { num: 3, name: 'PLATINUM MANAGER', psb: 19, lb: 0, fi: 0 },
    // { num: 15, name: 'Royal Crown Ranger', psb: 0, lb: 0, fi: 0 },
  ];
  var levelNum = 1;
  var totalPv = this.totalPv;

  if (totalPv >= 100) levelNum = 2;
  if (totalPv >= 400) levelNum = 3;
  if (totalPv >= 1600) levelNum = 4;
  // if (totalPv >= 7000) levelNum = 5; 
  if (totalPv >= 6400) levelNum = 5;
  if (totalPv >= 15000) {
    levelNum = 6;

    if (this.ranger.left >= 1 || this.ranger.middle >= 1 || this.ranger.right >= 1)
      levelNum = 7;

    if ((this.ranger.left >= 1 && this.ranger.middle >= 1) ||
        (this.ranger.left >= 1 && this.ranger.right >= 1) ||
        (this.ranger.middle >= 1 && this.ranger.right >= 1))
      levelNum = 8;

    if (this.ranger.left >= 1 && this.ranger.middle >= 1 && this.ranger.right >= 1)
      levelNum = 9;

    if (this.platinumRanger.left >= 1 &&
      this.platinumRanger.middle >= 1 &&
      this.platinumRanger.right >= 1)
      levelNum = 10;

    if (this.platinumRanger.left >= 2 &&
      this.platinumRanger.middle >= 2 &&
      this.platinumRanger.right >= 2)
      levelNum = 11;

    if (this.platinumRanger.left >= 3 &&
      this.platinumRanger.middle >= 3 &&
      this.platinumRanger.right >= 3)
      levelNum = 12;

    if (this.platinumRanger.left >= 4 &&
      this.platinumRanger.middle >= 4 &&
      this.platinumRanger.right >= 4)
      levelNum = 13;
  }

  return rsLevel[levelNum - 1];
});

mongoose.model('MemberXp', Schema);
