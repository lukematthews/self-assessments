require('dotenv').config();
// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const assessmentRouter = require("./routes/assessments");
const criteriaDefinitionsRouter = require("./routes/criteriaDefinitions");
const uiRouter = require("./routes/ui");
const connectDB = require("./config/dbConn")

connectDB();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", assessmentRouter);
app.use("/api/items", criteriaDefinitionsRouter);
app.use("/ui", uiRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
