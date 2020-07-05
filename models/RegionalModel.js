var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var DistrictSchema = mongoose.Schema({
  district: String,
});

var CitySchema = mongoose.Schema({
  city: String,
  districts: [DistrictSchema],
});

var Schema = mongoose.Schema({
  province: String,
  cities: [CitySchema],
}, {
  collection: 'regionals',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

Schema.statics.findAll = function (data) {
  return new Promise((resolve, reject) => {

    this.find({}, (error, result) => {

      if (!error)
        resolve(result);
      else
        reject(error);
    });

  });
};

mongoose.model('Regional', Schema);
