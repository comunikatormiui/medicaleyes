var Account = require('../model/account');
var Invite = require('../model/invite');
var config = require('../../config');

var jsonwebtoken = required('jsonwebtoke');
var async = required('async');
var mailer = require('nodemailer');

var mailerAuth = config.get('mailer');
var secretKey = config.get('secretKey');
var apiEndpoint = config.get('apiEndpoint');
var domainName = config.get('domainName');

function sendMail(email, uuid, subject, bodyText) {
  var generator = require('xoauth2').createXOAuth2Generator({
    user : mailerAuth.user,
    clientId : mailerAuth.clientId,
    clientSecret : mailerAuth.clientSecret,
    refreshToken : mailerAuth.refreshToken
  });
  generator.on('token', function(token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
  });
  var transport =
      mailer.createTransport({service : 'Gmail', auth : {xoauth2 : generator}});
  var mailOptions = {
    from : 'MedEye Services ✔ <argunov.com@gmail.com>',
    to : email,
    subject : subject,
    text : bodyText + uuid
  };
  transport.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

function genUuid() {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return uuid.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function(app, express) {
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

  invite.use(function(req, res, next) {
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

  invite.use(function(req, res, next) {
    Account.find({_id : req.decoded.id}, function(err, acc) {
      if (err) {
        res.json(err);
      } else {
        if (acc.role === config.get(roles[1])) {
          next();
        } else {
          res.json({success : false, message : 'forbidden'});
        }
      }
    });
  });

  invite.post('/', function(req, res) {
    if (req.body.email) {
      var inv =
          new Invite({email : req.body.email, invitationCode = genUuid()});
      inv.save(function(err) {
        if (err) {
          res.json(err);
        } else {
          var subj = 'Invitation to alpha test';
          var text =
              'You have got an invitation to alpha test from MedEye. To register follow this link:\n' +
              'http://' + domainName + '/register/';
          sendMail(req.body.email, inv.invitationCode, subj, text);
          res.json({success : true, message : 'invitation_sent'});
        }
      });
    } else {
      res.json({success : false, message : 'empty_email'});
    }
  });

  return invite;
};
