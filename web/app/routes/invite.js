var Account = require('../models/account');
var Invite = require('../models/invite');
var config = require('../../config');

var jsonwebtoken = require('jsonwebtoken');
var async = require('async');

var secretKey = config.get('secretKey');
var roles = config.get('roles');

function sendMail(email, uuid, subject, bodyText) {
  var generator = require('xoauth2').createXOAuth2Generator({
    user: mailerAuth.user,
    clientId: mailerAuth.clientId,
    clientSecret: mailerAuth.clientSecret,
    refreshToken: mailerAuth.refreshToken,
    accessToken: mailerAuth.accessToken
  });
  generator.on('token', function (token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
  });
  var transport =
    mailer.createTransport({ service: 'Gmail', auth: { xoauth2: generator } });
  var mailOptions = {
    from: 'Medical Eyes Services ✔ <argunov.com@gmail.com>',
    to: email,
    subject: subject,
    text: bodyText + uuid
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

function genUuid() {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return uuid.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function (app, express) {
  var invite = express.Router();
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

  invite.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
      jsonwebtoken.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.status(403).json(
            { success: false, message: 'invalid_auth_data' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).json(
        { success: false, message: 'token_is_not_provided' });
    }
  });

  invite.use(function (req, res, next) {
    Account.findOne({ _id: req.decoded.id }, function (err, acc) {
      if (err) {
        res.status(403).json({ success: false, message: 'invalid_auth_data' });
      } else {
        if (acc.role === roles[1]) {
          next();
        } else {
          res.status(403).json({ success: false, message: 'forbidden' });
        }
      }
    });
  });

  invite.post('/', function (req, res) {
    if (req.body.email && req.body.role) {
      var uuid = genUuid();
      var inv = new Invite({
        account = req.decoded.id,
        email = req.body.email,
        role = req.body.role,
        code = uuid
      });
      inv.save(function (err) {
        if (err) {
          res.json(err);
        } else {
          var subj = 'You have got invitation';
          var text = 'One of our admins sent to You invitation. To use your invite and register follow the link:\n' +
            'https://' + domainName + '/invite/';
          sendMail(req.body.email, uuid, subj, text);
          res.json({ success: true, message: 'ivinte_was_sent' });
        }
      });
    } else {
      res.json({ success: false, message: 'empty_credentials' });
    }
  });

  invite.get('/', function (req, res) {
    res.json({ success: true, message: 'not_implemented' });
  });

  invite.get('/list', function (req, res) {
    Invite.find({ account: req.decoded.id }, function (err, inv_list) {
      if (err) {
        res.json(err);
      } else {
        res.json({ success: true, message: 'your_invites', invites: inv_list });
      }
    })
  });

  invite.put('/', function (req, res) {
    res.json({ success: true, message: 'not_implemented' });
  });

  invite.delete('/', function (req, res) {
    res.json({ success: true, message: 'not_implemented' });
  });

  return invite;
};
