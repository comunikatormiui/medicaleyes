var crypto = require('crypto');
var async = require('async');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
  email : {type : String, required : true, unique : true},
  role : {type : String, default : 'user'},
  activationCode : String,
  passwordResetCode : String,
  passwordResetTime : Number,
  isActivated : {type : Boolean, default : false},
  hashedPassword : {type : String, required : true, select : false},
  salt : {type : String, required : true},
  created : {type : Date, default : Date.now}
});

accountSchema.virtual('password')
    .set(function(password) {
      this._plainPassword = password;
      this.salt = Math.random() + '';
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

accountSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha512', this.salt).update(password).digest('hex');
};

accountSchema.statics.authorize = function(email, password, callback) {
  var Account = this;
  var hash = '';
  async.waterfall(
      [
        function(callback) {
          Account.findOne({email : email})
              .select('hashedPassword')
              .exec(callback);
        },
        function(acc, callback) {
          if (acc) {
            hash = acc.hashedPassword;
            Account.findOne({email : email}, callback);
          } else {
            callback({message : 'account_does_not_exist'});
          }
        },
        function(acc, callback) {
          if (acc) {
            if (acc.encryptPassword(password) === hash) {
              callback(null, acc);
            } else {
              callback({message : 'incorrect_password'});
            }
          } else {
            callback({message : 'user_does_not_exist'});
          }
        }
      ],
      callback);
};

module.exports = mongoose.model('Account', accountSchema);
