var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  serialNumber: String,
  pin: String,

  memberId: String,
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  sponsorId: String,
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

  // Kalau isActive: 1 maka pin ga bisa dihapus ataupun dirubah
  isActive: Number,
  status: Number,
}, {
  collection: 'pins',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoose.model('Pin', Schema);
