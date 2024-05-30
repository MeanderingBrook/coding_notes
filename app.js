// Start Server and Run Website by...
// Terminal to Folder, coding-notes
// npm run devstart
// Open in Browser, http://localhost:3000/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog"); // Imports Routes for "Catalog" area of Site

const app = express();

// Create Mongoose Connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://paulapinecki:gohbyqmephy8symHaq@coding-notes.pla9ar3.mongodb.net/?retryWrites=true&w=majority&appName=coding-notes"

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
// nenwo6-muppoq-zaNsig

// view engine setup
app.set('views', path.join(__dirname, 'views')); // Platform-specific Directory separator (e.g., '/') is automatically added by Method
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Platform-specific Directory separator (e.g., '/') is automatically added by Method

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Adds Catalog Routes to Middleware

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
  res.render('error');
});

module.exports = app;
