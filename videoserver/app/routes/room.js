var Account = require('../models/account');
var Room = require('../models/room');

var async = require('async');

module.exports = function (app, express, socketio) {
  var room = express.Router();

  room.post('/', function (req, res) {
    var name = req.bosy.name;
    if (name) {
      async.waterfall([function (cb) {
        Account.findOne({ name: name }, cb);
      }, function (acc, cb) {
        if (acc) {
          Room.findOne({ author: acc._id }, function (err, room) {
            cb(null, { success: false, message: 'blabla' });
          });
        } else { cb(null, { success: false, message: 'not authorized' }); }
      }], function (err, msg) {
        if (err) { res.json(err); }
        else { res.json(msg); }
      });
    } else { res.json({ success: false, message: 'name not provided' }); }
  });

  room.get('/list', function (req, res) {
    Room.find({}, function (err, rooms) {
      if (err) { res.json(err); }
      else { res.json({ success: true, message: 'rooms', rooms: rooms }); }
    });
  });

  return room;
};