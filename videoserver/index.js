var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('./lib/mongoose');

var fs = require('fs');
var https = require('https');

var key = fs.readFileSync('./cert/key.key');
var cert = fs.readFileSync('./cert/cert.pem');
var https_options = { key: key, cert: cert, passphrase: 'cert' };

var app = express();
var server = https.Server(https_options, app);

app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('tiny'));

var io = require('socket.io')(server);
var upload = require('./lib/upload')(io);

var room = require('./app/routes/room')(app, express);
app.use('/api/room', room);

app.use(express.static(__dirname + '/build'));

app.get('*', function (req, res) { res.sendFile(__dirname + '/build/index.html'); });

var port = 3001;

server.listen(port, function () {
  console.log('Server running on', server.address().port);
});

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
})
  .listen(3000);