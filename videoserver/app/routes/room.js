var Account = require('../models/account');
var Room = require('../models/room');

module.exports = function (app, express, socketio) {
  var room = express.Router();

  room.post('/', function (req, res) {

  });

  return room;
};