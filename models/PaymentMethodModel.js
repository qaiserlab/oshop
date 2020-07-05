var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  paymentMethod: String,
}, {
  collection: 'payment_methods',
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

mongoose.model('PaymentMethod', Schema);
