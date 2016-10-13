var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  lead: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  parties: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  path: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);