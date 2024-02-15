var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require("connect-flash");
const expressEjsLayout = require("express-ejs-layouts");
const passport = require("passport");
require("dotenv").config();


var indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const validateMiddleware = require('./middlewares/validate.middleware');
const localPassport = require("./passports/local.passport");
const authMiddleware = require('./middlewares/auth.middleware');
const googlePassport = require('./passports/google.passport');
const deserializeUserPassport = require('./passports/deserializeUser.passport');
const serializeUserPassport = require('./passports/serializeUser.passport');

var app = express();
app.use(session({
  secret: 'Node auth',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(serializeUserPassport);
passport.deserializeUser(deserializeUserPassport);
passport.use("local", localPassport);
passport.use("google", googlePassport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressEjsLayout);

app.use(validateMiddleware);
app.use('/auth', authRouter);
app.use(authMiddleware);
app.use('/', indexRouter);

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
