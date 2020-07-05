var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  courier: String,
  service: String,
  province: String,
  city: String,
  district: String,
  price: Number,
}, {
  collection: 'shipment_prices',
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

mongoose.model('ShipmentPrice', Schema);
