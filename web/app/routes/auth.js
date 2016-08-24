var Account = require('../models/account');
var Invite = require('../models/invite');
var config = require('../../config');

var jsonwebtoken = require('jsonwebtoken');
var async = require('async');
var mailer = require('nodemailer');

var mailerAuth = config.get('mailer');
var secretKey = config.get('secretKey');
var apiEndpoint = config.get('apiEndpoint');
var domainName = config.get('domainName');

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

function createToken(acc) {
  var token = jsonwebtoken.sign({ id: acc._id, email: acc.email }, secretKey, { expiresIn: '24h' });
  return token;
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
  var auth = express.Router();
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

  // Login with existing account
  auth.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
      Account.authorize(email, password, function (err, account) {
        if (err) {
          res.json(err);
        } else {
          var token = createToken(account);
          res.json({
            success: true,
            message: 'successful_login',
            email: account.email,
            token: token
          });
        }
      });
    } else {
      res.json({ success: false, message: 'empty_credentials' });
    }
  });

  // Activate new registered
  auth.post('/activate', function (req, res) {
    var code = req.body.code;
    if (code) {
      Account.findOne({ activationCode: code }, function (err, acc) {
        if (err) {
          res.json(err);
        }
        if (acc) {
          acc.activationCode = 'X';
          acc.isActivated = true;
          acc.save(function (err) {
            res.json({ success: true, message: 'account_activated' });
          });
        } else {
          res.json({ success: false, message: 'account_not_found' });
        }
      });
    } else {
      res.json({ success: false, message: 'activation_code_not_provided' });
    }
  });

  auth.post('/restore', function (req, res) {
    var email = req.body.email;
    if (email && email.length > 0) {
      Account.findOne({ email: email }, function (err, acc) {
        if (err) {
          res.json(err);
        } else {
          if (acc) {
            acc.passwordResetCode = genUuid();
            acc.save(function (err) {
              if (err) {
                res.json(err);
              } else {
                var subj = 'Reset password';
                var text = 'To reset your password follow this link:\n' +
                  'https://' + domainName + '/reset/';
                sendMail(acc.email, acc.passwordResetCode, subj, text);
                res.json({ success: true, message: 'check_email' });
              }
            });
          } else {
            res.json({ success: false, message: 'account_not_found' });
          }
        }
      });
    } else {
      res.json({ success: false, message: 'email_not_valid' });
    }
  });

  auth.post('/reset', function (req, res) {
    var password = req.body.password;
    var code = req.body.code;
    if (password && password.length > 0) {
      if (code && code.length > 0) {
        Account.findOne({ passwordResetCode: code }, function (err, acc) {
          if (err) {
            res.json(err);
          } else {
            if (acc) {
              acc.passwordResetCode = 'X';
              acc.passwordResetTime = Date.now();
              acc.password = password;
              acc.save(function (err) {
                if (err) {
                  res.json(err);
                } else {
                  res.json({ success: true, message: 'password_changed' });
                }
              });
            } else {
              res.json({ success: false, message: 'account_not_found' });
            }
          }
        });
      } else {
        res.json({ success: false, message: 'reset_code_not_valid' });
      }
    } else {
      res.json({ success: false, message: 'password_not_valid' });
    }
  });

  // Signup new account
  auth.post('/signup', function (req, res) {
    if (req.body.email && req.body.password && req.body.code) {
      async.waterfall(
        [
          function (callback) {
            Invite.findOne({ code: req.body.code }, function (err, inv) {
              if (err) {
                callback(err);
              } else {
                if (inv) {
                  inv.code = 'X';
                  inv.save(function (err) {
                    if (err) {
                      callback(err);
                    } else {
                      Account.findOne({ email: req.body.email }, callback);
                    }
                  });
                } else {
                  callback(null, { success: false, message: 'you_have_no_invitation' });
                }
              }
            });
          },
          function (acc, callback) {
            if (acc) {
              callback(null, { success: false, message: 'provided_email_already_used' });
            } else {
              var uuid = genUuid();
              var account = new Account({
                email: req.body.email,
                password: req.body.password,
                activationCode: uuid
              });
              var token = createToken(account);
              account.save(function (err) {
                var subj = 'Activate account';
                var text = 'To activate your account follow this link:\n' +
                  'https://' + domainName + '/activate/';
                sendMail(req.body.email, uuid, subj, text);
                callback(null, {
                  success: true,
                  message: 'account_has_been_created',
                  email: req.body.email,
                  token: token
                });
              });
            }
          }
        ],
        function (err, message) {
          if (err) {
            res.json(err);
          }
          res.json(message);
        });
    } else {
      res.json({ success: false, message: 'empty_credentials' });
    }
  });

  // Token check middleware
  auth.use(function (req, res, next) {
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

  // Decode token
  auth.get('/me', function (req, res) { res.json(req.decoded); });

  return auth;
};
