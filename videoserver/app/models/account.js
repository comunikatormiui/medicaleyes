var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accoutSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accoutSchema);