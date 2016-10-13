var Account = require('../models/account');
var Room = require('../models/room');
var smd = require('../../lib/smd');

var exec = require('child_process').execSync;
var uuid = require('node-uuid');
var async = require('async');

var dir = __dirname;
var fPath = dir.slice(0, -11) + '/uploads/';

module.exports = function (app, express) {
  var room = express.Router();

  room.get('/path/:path?', function (req, res) {
    var path = req.params.path;
    if (!path) { res.json(smd(false, 'path not provided', null)); }
    else {
      Room.find({ path: path }, function (e, d) {
        if (e) { res.json(e); }
        else { res.json(smd(true, 'room', d)); }
      });
    }
  });

  room.get('/list', function (req, res) {
    Room.find({}, function (e, r) {
      if (e) { res.json(e); }
      else { res.json(smd(true, 'rooms list', r)); }
    });
  });

  room.use(function (req, res, next) {
    var name = req.body.name;
    if (!name) { res.json(smd(false, 'name not provided', null)); }
    else {
      Account.findOne({ name: name }, function (e, a) {
        if (e) { res.json(e); }
        else {
          if (!a) { res.status(403).json(smd(false, 'not authenticated', null)); }
          else { next(); }
        }
      });
    }
  });

  room.post('/', function (req, res) {
    var name = req.body.name;
    async.waterfall([function (cb) {
      Account.findOneAndUpdate({ name: name, status: 'online' }, { status: 'busy' }, cb);
    }, function (a, cb) {
      if (!a) { cb({ error: 'not allowed' }); }
      else {
        var uid = uuid.v4();
        var p = [];
        p.push(a._id);
        var room = new Room({
          author: a._id,
          lead: a._id,
          parties: p,
          path: uid
        });
        room.save(function (e) {
          if (e) { cb(e); }
          else { exec('mkdir ' + fPath + uid); cb(null, smd(true, 'room saved', room.path)) }
        });
      }
    }], function (e, m) {
      if (e) { res.json(e); }
      else { res.json(m); }
    });
  });

  room.delete('/:path?', function (req, res) {
    var path = req.params.path;
    if (!path) { res.json(smd(false, 'path not provided', null)); }
    else {
      var name = req.body.name;
      async.waterfall([function (cb) {
        Account.findOneAndUpdate({ name: name, status: 'online' }, { status: 'busy' }, cb);
      }, function (a, cb) {
        if (!a) { cb({ error: 'not allowed' }); }
        else {
          //TODO: check authority of room
          /*
          Room.remove({ path: path }, function (e) {
            if (e) { res.json(e); }
            else {
              exec('rm -rf ' + fPath + path);
              res.json(smd(true, 'room deleted', null));
            }
          });*/
        }
      }], function (e, m) {
        if (e) { res.json(e); }
        else { res.json(m); }
      });
    }
  });

  return room;
};