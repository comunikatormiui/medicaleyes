var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scanSchema = new Schema({
  account : {type : Schema.Types.ObjectId, ref : 'Account', required : true},
  inuri : {type : String, default : '.'},
  out : [ {outType : String, outValue : String} ],
  created : {type : Date, default : Date.now}
});

module.exports = mongoose.model('Scan', scanSchema);
