var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('./lib/mongoose');

var app = express();
var http = require('http').Server(app);

app.use(bodyParser.urlencoded({extended : true, limit : '2mb'}));
app.use(bodyParser.json({limit : '2mb'}));
app.use(morgan('tiny'));

var auth = require('./app/routes/auth')(app, express);
app.use('/api/v1/auth', auth);

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
  var port = 3000;
  http.listen(port, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('listening on port ' + port);
    }
  });
}
