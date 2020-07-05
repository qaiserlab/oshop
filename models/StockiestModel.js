var mongoose = require('mongoose');

/*********************
function validate()
*********************/

var memberIdValidator = [
  {
    validator: function (value, callback) {
      return new Promise((resolve, reject) => {
        var MemberModel = mongoose.model('Member');
  
        MemberModel.findOne({ memberId: value }, 'memberId', function (error, row) {
          resolve(row?true:false);
        });
      });
    },
    message: 'Member ID `{VALUE}` not found',
  },

  {
    validator: function (value, callback) {
      return new Promise((resolve, reject) => {
        var StockiestModel = mongoose.model('Stockiest');

        StockiestModel.findOne({ memberId: value }, 'memberId', function (error, row) {
          callback(!row);
        });
      });
    },
    message: 'Member ID `{VALUE}` already registered as stockiest',
  },

];

/*********************
function Schema()
*********************/

var Schema = mongoose.Schema({
  memberId: {
    type: String,
    required: [true, 'Member ID required'],
    unique: true,
    validate: memberIdValidator,
  },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  type: {
    type: String,
    required: [true, 'Type required'],
  },
}, {
  collection: 'stockiests',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

/*********************
function pre()
*********************/

Schema.pre('save', function (next) {
  var MemberModel = mongoose.model('Member');

  MemberModel.findOne({ memberId: this.memberId }, '_id', (error, row) => {
    this.member = row._id;

    next();
  });
});

mongoose.model('Stockiest', Schema);
