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

function writeData(data, fName, rid, fType, vCount, socket) {
  if (!fs.existsSync(fPath + rid + '/' + fName + fType)) {
    fs.writeFileSync(fPath + rid + '/' + fName + fType, data);
    socket.emit('message', { part: vCount, fileName: fName, id: rid });
  } else {
    fs.appendFileSync(fPath + rid + '/' + fName + fType, data);
    socket.emit('message', { part: vCount, fileName: fName, id: rid });
  }
}
function fixWebmAudio(fileName, rid) {
  var file = fPath + rid + '/' + fileName + vFe;
  var audioFile = fPath + rid + '/' + fileName + aFe;
  var ffmpegcommand = 'ffmpeg -i ' + file + ' ' + fPath + rid + '/' + 'out' + fileName + vFe;
  var postManip = 'rm -f ' + file + ' && mv ' + fPath + rid + '/' + 'out' + fileName + vFe + ' ' + file;
  console.log(ffmpegcommand);

  exec(ffmpegcommand, { maxBuffer: 20000 * 1024 }, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
    } else {
      console.log('ffmpeg ends with', fileName);
      exec(postManip, { maxBuffer: 20000 * 1024 });
    }
  });
}

module.exports = function (io) {
  var confs = [];
  io.on('connection', function (socket) {
    var vCount = 0;
    var fName = uuid.v1();
    var fType = vFe;

    socket.on('message', function (data) {
      var rid = data.id;
      if (data.rw instanceof Buffer) {
        vCount++;
        writeData(data.rw, fName, rid, fType, vCount, socket);
      } else if (data.completed) {
        fixWebmAudio(fName, rid);
      } else { socket.broadcast.emit('message', data); }
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