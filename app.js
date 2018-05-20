const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const driveRouter = require('./routes/drives');
const donationRouter = require('./routes/donations');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


app.use(function (req, res, next) {
  res.sendError = function (err) {
    res.status(500).send({err: err.toString(), info: JSON.stringify(err)})
  }

  res.jsonDone = function (err, json) {
    if (err) {
      res.sendError(err)
      return
    }

    res.send(json)
  }

  next()
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
 })

app.use('/', indexRouter);
app.use('/drives', driveRouter);
app.use('/donations', donationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    message: err.message || err.toString()
  })
});

module.exports = app;
