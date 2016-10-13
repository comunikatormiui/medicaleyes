var Account = require('../models/account');
var Room = require('../models/room');

var async = require('async');

module.exports = function (app, express) {
  var account = express.Router();

  account.post('/login', function (req, res) {
    var name = req.body.name;
    if (name) {
      Account.findOne({ name: name }, function (err, acc) {
        if (err) { res.json(err); }
        else {
          if (acc) {
            acc.status = 'online';
            acc.save(function (err) {
              if (err) { res.json(err); }
              else { res.json({ success: true, message: 'login done', name: name }); }
            });
          } else {
            res.json({ success: false, message: 'account not found' });
          }
        }
      });
    } else { res.json({ success: false, message: 'name not provided' }); }
  });

  account.post('/logout', function (req, res) {
    var name = req.body.name;
    if (name) {
      Account.findOne({ name: name }, function (err, acc) {
        if (err) { res.json(err); }
        else {
          acc.status = 'offline';
          acc.save(function (err) {
            if (err) { res.json(err); }
            else { res.json({ success: true, message: 'logout done' }); }
          });
        }
      });
    } else { res.json({ success: false, message: 'name not provided' }); }
  });

  account.get('/list', function (req, res) {
    Account.find({}, function (err, accs) {
      if (err) { res.json(err); }
      else { res.json({ success: true, message: 'accounts', accounts: accs }); }
    });
  });

  account.get('/:name', function (req, res) {
    var name = req.params.name;
    if (name) {
      Account.findOne({ name: name }, function (err, acc) {
        if (err) { res.json(err); }
        else { res.json({ success: true, message: 'account', account: acc }); }
      });
    } else { res.json({ success: false, message: 'name not provided' }); }
  });

  account.post('/', function (req, res) {
    var name = req.body.name;
    if (name) {
      async.waterfall([
        function (cb) {
          Account.findOne({ name: name }, cb);
        },
        function (acc, cb) {
          if (acc) { cb(null, { success: false, message: 'name already taken' }); }
          else {
            var acc = new Account({ name: name, status: 'online' });
            acc.save(function (err) {
              if (err) { cb(err) }
              else { cb(null, { success: true, message: 'account created', name: name }); }
            });
          }
        }
      ], function (err, msg) {
        if (err) { res.json(err); }
        else { res.json(msg); }
      });
    } else { res.json({ success: false, message: 'name not provided' }); }
  });

  return account;
};