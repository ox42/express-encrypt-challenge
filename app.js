var createError = require('http-errors');
var express = require('express');
var path = require('path');

require('dotenv').config();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//var logger = require('morgan');
//app.use(logger('dev')); //log requests?

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/data', require('./routes/data'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : undefined;

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.error ? res.locals.message : 'An error occurred.');
});

module.exports = app;
