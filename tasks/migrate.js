var mongoose = require('mongoose');
var loader = require('mongoose-model-loader');

var db = mongoose.connect('mongodb://127.0.0.1/cozmeed', {
  useMongoClient: true,
});

db.on('error', console.error.bind(console, 'Mongodb connection error:'));
db.once('open', function() {
  console.log("Mongodb connected!");
  loader(__dirname + '/../models');

  // updateMember();
  // initBank();
  // resetAll();
  // resetLevel();
  // resetShipment();

  // trimProductId();
  // resetMemberXp();

  resetStockiestPassword();
});

function resetAll() {
  var BonusAchievementModel = mongoose.model('BonusAchievement');
  var BonusDirectSellingModel = mongoose.model('BonusDirectSelling');
  var BonusPointModel = mongoose.model('BonusPoint');
  var BonusSponsorModel = mongoose.model('BonusSponsor');
  var EwalletModel = mongoose.model('Ewallet');
  var OrderModel = mongoose.model('Order');
  var PinModel = mongoose.model('Pin');
  var PinStockModel = mongoose.model('PinStock');
  var StockiestModel = mongoose.model('Stockiest');
  var StockiestOrderModel = mongoose.model('StockiestOrder');
  var StockModel = mongoose.model('Stock');

  var MemberPvModel = mongoose.model('MemberPv');
  var MemberMonthlyPvModel = mongoose.model('MemberMonthlyPv');

  BonusAchievementModel.collection.drop();
  BonusDirectSellingModel.collection.drop();
  BonusPointModel.collection.drop();
  BonusSponsorModel.collection.drop();
  EwalletModel.collection.drop();
  OrderModel.collection.drop();
  PinModel.collection.drop();
  PinStockModel.collection.drop();
  StockiestModel.collection.drop();
  StockiestOrderModel.collection.drop();
  StockModel.collection.drop();

  MemberPvModel.collection.drop();
  MemberMonthlyPvModel.collection.drop();

  resetMemberXp();
}

async function resetShipment() {

  var db = require('mysql-promise')();

  db.configure({
    host: "localhost",
    user: "root",
    password: "",
    database: 'db_cozmeed_net',
  });

  var [rsProvince] = await db.query(`select * from tbl_shipment_province`);
  var [rsCity] = await db.query(`select * from tbl_shipment_city`);
  var [rsDistrict] = await db.query(`select * from tbl_shipment_district`);

  var rowProvince, rowCity, rowDistrict;

  var rsRegional = rsProvince.map(row => {
    rowProvince = {
      province: row.name,
    };

    rowProvince.cities = rsCity.filter(row_ => row_.province_id == row.id).map(row_ => {
      rowCity = {
        city: row_.name,
      };

      rowCity.districts = rsDistrict.filter(row__ => row__.city_id == row_.id).map(row__ => {
        rowDistrict = {
          district: row__.name,
        };

        return rowDistrict;
      });

      return rowCity;
    });

    return rowProvince;
  });

  var RegionalModel = mongoose.model('Regional');

  RegionalModel.collection.drop(() => {
    RegionalModel.create(rsRegional);
  });

  // price

  var [rsPrice] = await db.query(`
    select
    	'JNE' as courier,
    	tbl_shipment_cost.service,

    	tbl_shipment_province.name as province,
    	tbl_shipment_city.name as city,
    	tbl_shipment_district.name as district,
    	tbl_shipment_cost.cost as price
    from
    	tbl_shipment_cost
    left join tbl_shipment_district
    on tbl_shipment_cost.id_district = tbl_shipment_district.id

    left join tbl_shipment_city
    on tbl_shipment_district.city_id = tbl_shipment_city.id

    left join tbl_shipment_province
    on tbl_shipment_city.province_id = tbl_shipment_province.id

    limit 10000, 10000
    `);

  var ShipmentPriceModel = mongoose.model('ShipmentPrice');

  // ShipmentPriceModel.collection.drop(() => {
    ShipmentPriceModel.create(rsPrice);
  // });

  // courier

  // var [rsService] = await db.query(`select * from tbl_shipment_cost group by code, service order by service desc`);
  //
  // var ShipmentCourierModel = mongoose.model('ShipmentCourier');
  //
  // ShipmentCourierModel.collection.drop(() => {
  //
  //   var services = rsService.map(row => {
  //     return {
  //       service: row.service,
  //       description: row.name,
  //     };
  //   });
  //
  //   var rsCourier = [
  //     { courier: 'Pick Up' },
  //     { courier: 'JNE', services },
  //   ];
  //   ShipmentCourierModel.create(rsCourier);
  // });
}

async function updateMember() {
  var MemberModel = mongoose.model('Member');

  var rsMember = await MemberModel.find({ email: 'info@cozmeed.net' });

  rsMember.forEach(row => {
    console.log('member id: ' + row.memberId);
    MemberModel.findOneAndUpdate({ memberId: row.memberId }, { email: row.memberId });
  });
}

async function fillProductId() {
  var ProductModel = mongoose.model('Product');

  var rsProduct = await ProductModel.find();

  rsProduct.forEach(async row => {

    if (!row.productId) {
      var id = row._id;
      var row_ = await ProductModel.findById(id);
      row_.productId = row_.skuNumber;
      row_.save();
      console.log(row_);
    }
  });

}

async function trimProductId() {
  var ProductModel = mongoose.model('Product');

  var rsProduct = await ProductModel.find();

  rsProduct.forEach(async row => {

    var id = row._id;
    var row_ = await ProductModel.findById(id);

    row_.productId = row_.productId.trim();
    row_.skuNumber = row_.skuNumber.trim();

    row_.save();

  });

}

async function initBank() {
  var BankModel = mongoose.model('Bank');

  BankModel.collection.drop(() => {
    var data = [
      { bank: 'BCA', accountNumber: '10001000', accountName: 'Cozmeed Network' },
      { bank: 'BRI', accountNumber: '10005000', accountName: 'Cozmeed Network' },
      { bank: 'Mandiri', accountNumber: '10006000', accountName: 'Cozmeed Network' },
      { bank: 'CIMB Niaga', accountNumber: '10004000', accountName: 'Cozmeed Network' },
    ];
    BankModel.create(data);
  });
}

function resetStockiestPassword() {
  var MemberModel = mongoose.model('Member');

  MemberModel.find({}).then(rsMember => {

    var rsMember_ = rsMember.map(row => {
      // console.log(row.memberId);
      row.stockiestPassword = row.password;
      row.stockiestSalt = row.salt;

      return row;
    });

    // MemberModel.collection.drop(() => {
    //   MemberModel.create(rsMember_);
    // });
  });

}

function resetMemberXp() {
  var MemberModel = mongoose.model('Member');
  var MemberXpModel = mongoose.model('MemberXp');

  // Reset Member XP

  MemberXpModel.collection.drop(() => {
    MemberModel.find({}).then(rsMember => {
      var rsMemberXp = rsMember.map(row => {
        return {
          memberId: row.memberId,
          personalPv: 0,
          leftPv: 0,
          middlePv: 0,
          rightPv: 0,
          rangerUp: false,
          platinumRangerUp: false,
          ranger: {
            left: 0,
            middle: 0,
            right: 0,
          },
          platinumRanger: {
            left: 0,
            middle: 0,
            right: 0,
          },
        };
      });

      MemberXpModel.create(rsMemberXp);

    });

  });
}
