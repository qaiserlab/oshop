var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var ServiceSchema = mongoose.Schema({
  service: String,
  description: String,
});

var Schema = mongoose.Schema({
  courier: String,
  services: [ServiceSchema],
}, {
  collection: 'shipment_couriers',
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

mongoose.model('ShipmentCourier', Schema);
