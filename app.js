var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/authRoutes');
var messageRouter = require('./routes/messageRoutes');

var app = express();

const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const { compare } = require('bcryptjs');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

passport.use(new LocalStrategy(
  function(email, password, done) {
      User.findOne({ email }, function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }

          compare(password, user.password, function(err, success) {
              if (err) { return next(err); };
              if (!success) { return done(null, false); };
              return done(null, user);
          });
      });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

app.use('/', authRouter);

app.use('/', messageRouter);

app.post('/sign-in', passport.authenticate('local', { failureRedirect: '/sign-in', successRedirect: '/' }));

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
