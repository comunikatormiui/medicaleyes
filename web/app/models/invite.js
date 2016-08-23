var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  code: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invite', inviteSchema);