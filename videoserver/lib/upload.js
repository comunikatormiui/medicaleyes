var fs = require('fs');
var exec = require('child_process').exec;
var uuid = require('node-uuid');
var _ = require('underscore');
var config = require('../config');
var Room = require('../app/models/room');

var vFe = config.get("videoFileExtension");
var aFe = config.get("audioFileExtension");
var blobs = [];
var dir = __dirname;
var fPath = dir.slice(0, -4) + '/uploads/';

function writeData(data, fName, fType, vCount, ws) {
  if (!fs.existsSync(fPath + fName + fType)) {
    ws.send(JSON.stringify({ fileName: fName }));
    fs.writeFileSync(fPath + fName + fType, data);
    ws.send(JSON.stringify({ part: vCount, fileName: fName }));
  } else {
    fs.appendFileSync(fPath + fName + fType, data);
    ws.send(JSON.stringify({ part: vCount, fileName: fName }));
  }
}
function fixWebmAudio(fileName, callback) {
  var file = fPath + fileName + vFe;
  var audioFile = fPath + fileName + aFe;
  var ffmpegcommand = 'ffmpeg -i ' + file + ' ' + fPath + 'out' + fileName + vFe;
  var postManip = 'rm -f ' + file + ' && mv ' + fPath + 'out' + fileName + vFe + ' ' + file;
  console.log(ffmpegcommand);

  exec(ffmpegcommand, { maxBuffer: 20000 * 1024 }, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
    } else {
      console.log('ffmpeg ends with', fileName);
      exec(postManip, { maxBuffer: 20000 * 1024 }, function (error, stdout, stderr) {
        if (error) {
          console.log(error);
        } else {
          callback();
        }
      });
    }
  });
}

module.exports = function (io) {
  var confs = [];
  io.on('connection', function (socket) {
    socket.on('message', function (data) {
      socket.broadcast.emit('message', data);
    });

    socket.on('join', function (data) {
      var rid = data.id;
      confs.push({ id: rid, socket: socket });
      var count = 0;
      _.each(confs, function (cnf) {
        if (cnf.id === rid) count++;
      });
      if (count <= 2) {
        socket.emit('accept', { id: rid, count: count });
      } else { socket.emit('reject', { id: rid }); }
    });

    socket.on('check', function (data) {
      var rid = data.id;
      Room.findOne({ path: rid }, function (e, r) {
        if (e) { console.log(e); }
        else {
          if (r) { socket.emit('roomchecked', { success: true, id: rid }); }
          else { socket.emit('roomchecked', { success: false, id: rid }); }
        }
      });
    });
  });
};