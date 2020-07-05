var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: String,
  sponsorId: String,
  level: Number,
}, {
  collection: 'network_matrixs',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

Schema.statics.createData = function (data) {
  return new Promise((resolve, reject) => {

    // data.slug = slug;

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

    // data.slug = slug;

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

mongoose.model('NetworkMatrix', Schema);
