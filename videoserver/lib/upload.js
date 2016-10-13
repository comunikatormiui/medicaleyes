var fs = require('fs');
var exec = require('child_process').exec;
var uuid = require('node-uuid');
var config = require('../config');

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

module.exports = function (wss) {
  var sockets = [];
  var conferences = {};

  wss.on('connection', function connection(ws) {
    sockets.push(ws);

    var fName = uuid.v4();
    var vCount = 0;
    var fType = vFe;

    function broadcast(data) {
      sockets.forEach(function (socket) {
        socket.send(data);
      });
    }

    function cb() {
      fName = uuid.v4();
    }

    ws.on('message', function incoming(data) {
      if (data instanceof Buffer) {
        vCount++;
        writeData(data, fName, fType, vCount, ws);
      } else {
        var data = JSON.parse(data);
        if (data.completedVideo) {
          fixWebmAudio(data.completedVideo, cb);
        } else {
          console.log(data);
          broadcast(JSON.stringify(data));
        }
      }
    });
  });
};