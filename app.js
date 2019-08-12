var express = require('express');  
var path = require('path');
var favicon = require("serve-favicon");
var logger = require("morgan");
var passport = require('passport');
var app = express();  
var server = require('http').createServer(app);  
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./models/db');
require('./app_api/passport');


app.use(passport.initialize())

var routesApi = require('./app_api/routes/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routesApi);
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});



// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  console.log(err);
});

server.listen(8080);  