var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  path: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);