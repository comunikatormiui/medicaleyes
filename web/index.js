var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('./lib/mongoose');

var fs = require('fs');
var https = require('https');

var key = fs.readFileSync('./cert/server.key');
var cert = fs.readFileSync('./cert/cert.crt');
var https_options = {key : key, cert : cert};

var app = express();
var server = https.Server(https_options, app);

app.use(bodyParser.urlencoded({extended : true, limit : '2mb'}));
app.use(bodyParser.json({limit : '2mb'}));
app.use(morgan('tiny'));

var auth = require('./app/routes/auth')(app, express);
app.use('/api/v1/auth', auth);

var invite = require('./app/routes/invite')(app, express);
app.use('/api/v1/invite', invite);

var scan = require('./app/routes/scan')(app, express);
app.use('/api/v1/scan', scan);

app.use(express.static(__dirname + '/build'));

app.get('*',
        function(req, res) { res.sendFile(__dirname + '/build/index.html'); });

var cluster = require('cluster');
var os = require('os');
var numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; ++i) {
    cluster.fork();
  }
} else {
  var port = 3001;
  server.listen(port, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('listening on port ' + port);
    }
  });

  var http = require('http');
  http.createServer(function(req, res) {
        res.writeHead(
            301, {"Location" : "https://" + req.headers['host'] + req.url});
        res.end();
      })
      .listen(3000);
}
