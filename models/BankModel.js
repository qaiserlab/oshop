var mongoose = require('mongoose');

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  bank: String,
  accountNumber: String,
  accountName: String,
}, {
  collection: 'banks',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

Schema.statics.getBankList = function (data) {
  return [
    { bank: 'Bank BRI' },
    { bank: 'Bank Mandiri' },
    { bank: 'Bank BCA' },
    { bank: 'Bank BNI' },
    { bank: 'Bank CIMB Niaga' },
    { bank: 'Bank BTN' },
    { bank: 'Bank Panin' },
    { bank: 'Bank Permata' },
    { bank: 'Bank Danamon' },
    { bank: 'Bank Maybank Indonesia' },
    { bank: 'Bank Mega' },
    { bank: 'Bank Bukopin' },
    { bank: 'Bank OCBC NISP' },
    { bank: 'Citibank' },
    { bank: 'Bank Muamalat Indonesia' },
    { bank: 'Bank BRI Syariah' },
    { bank: 'Bank Mandiri Syariah' },
    { bank: 'Bank BCA Syariah' },
    { bank: 'Bank BNI Syariah' },
    { bank: 'Bank Panin Syariah' },
    { bank: 'Bank Danamon Syariah' },
    { bank: 'Bank Maybank Syariah Indonesia' },
    { bank: 'Bank Mega Syariah' },
    { bank: 'Bank Bukopin Syariah' },
    { bank: 'Bank Victoria Syariah' },
  ];
};

mongoose.model('Bank', Schema);
