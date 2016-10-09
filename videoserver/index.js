var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('./lib/mongoose');

var http = require('http');

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('tiny'));

app.use(express.static(__dirname + '/build'));

app.get('*', function (req, res) { res.sendFile(__dirname + '/build/index.html'); });

var port = 3000;

server.listen(port, function () {
  console.log('Server started on port: ' + port);
});