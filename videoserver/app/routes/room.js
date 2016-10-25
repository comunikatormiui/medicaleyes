var Room = require('../models/room');

var exec = require('child_process').execSync;
var uuid = require('node-uuid');

var dir = __dirname;
var fPath = dir.slice(0, -11) + '/uploads/';

module.exports = function (app, express) {
  var room = express.Router();

  room.get('/', function (req, res) {
    var uid = uuid.v4();
    var room = new Room({
      path: uid
    });
    room.save(function (e) {
      if (e) { res.json(e); }
      else {
        //exec('mkdir ' + fPath + uid);
        res.json({ id: uid });
      }
    });
  });

  return room;
};