var Room = require('../models/room');

var exec = require('child_process').execSync;
var uuid = require('node-uuid');
var fs = require('fs');

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
        exec('mkdir ' + fPath + uid);
        res.json({ id: uid });
      }
    });
  });

  room.get('/files/:path?', function (req, res) {
    var path = req.params.path;
    if (!path) { res.json({ message: 'path not provided' }) }
    else {
      fs.readdir(fPath + path + '/', function (e, f) {
        if (e) { res.json(e); }
        else { res.json({ files: f }); }
      });
    }
  });

  room.get('/getStream/:path?/:filename?', function (req, res) {
    var file = fPath + req.params.path + '/' + req.params.filename;
    fs.stat(file, function (err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.sendStatus(404);
        }
        res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
        return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/webm"
      });

      var stream = fs.createReadStream(file)
        .on('open', function () {
          stream.pipe(res);
        }).on('error', function (err) {
          res.end(err);
        });
    });
  });

  room.post('/download', function (req, res) {
    var file = fPath + req.body.path + '/' + req.body.filename;
    res.download(file);
  });

  return room;
};