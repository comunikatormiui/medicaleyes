var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteSchema = new Schema({
  email : {type : String, required : true},
  invitationCode : {type : String, required : true},
  created : {type : Date, default : Date.now}
});

module.exports = mongoose.model('Invite', inviteSchema);
