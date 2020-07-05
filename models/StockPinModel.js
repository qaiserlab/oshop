var mongoose = require('mongoose');

/*********************
function Schema()
*********************/
// kalau admin create pin dengan sponsor, masuk ke credit 1
var Schema = mongoose.Schema({
  memberId: String,
  credit: Number,
  debit: Number,
  balance: Number,
}, {
  collection: 'stock_pins',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function virtual()
*********************/

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

Schema.statics.createData = function (data) {
  return new Promise((resolve, reject) => {

    data.credit = 1;
    data.debit = 0;
    // data.balance =

    this.create(data, (error, data) => {
      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

Schema.statics.updateData = function (id, data) {
  return new Promise((resolve, reject) => {

    this.findByIdAndUpdate(id, data, (error, data) => {
      if (!error) {
        this.findById(id, (error, data) => {
          resolve(data);
        });
      }
      else
        reject(error);
    });

  });
};

Schema.statics.deleteOneData = function (id) {
  return new Promise((resolve, reject) => {

    this.findByIdAndRemove(id, (error, data) => {
      if (!error)
        resolve(data);
      else
        reject(error);
    });

  });
};

mongoose.model('StockPin', Schema);
