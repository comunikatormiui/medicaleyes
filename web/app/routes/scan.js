var Account = require('../models/account');
var Scan = require('../models/scan');
var config = require('../../config');

var jsonwebtoken = require('jsonwebtoken');
var async = require('async');

var secretKey = config.get('secretKey');

module.exports = function(app, express) {
  var scan = express.Router();
  /*
  // CORS
  auth.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,
  Authorization,Content-Length,
  X-Requested-With, x-access-token');
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
  });
  */

  scan.use(function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
      jsonwebtoken.verify(token, secretKey, function(err, decoded) {
        if (err) {
          res.status(403).json(
              {success : false, message : 'invalid_auth_data'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).json(
          {success : false, message : 'token_is_not_provided'});
    }
  });

  scan.post('/', function(req, res) {
    res.json({success : true, message : 'not_implemented'});
  });

  scan.get('/', function(req, res) {
    res.json({success : true, message : 'not_implemented'});
  });

  scan.get('/list', function(req, res) {
    res.json({success : true, message : 'not_implemented'});
  });

  scan.put('/', function(req, res) {
    res.json({success : true, message : 'not_implemented'});
  });

  scan.delete('/', function(req, res) {
    res.json({success : true, message : 'not_implemented'});
  });

  return scan;
};
