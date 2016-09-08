var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');

module.exports = function (app) {

  // this is good enough for now but you'll
  // want to use connect-mongo or similar
  // for persistant sessions
  app.use(logger('combined'));
  app.use(cookieParser());
  app.use(session({
    secret: 'building a blog',
    resave: false,
    saveUninitialized: true}));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.static('public'));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  // expose session to views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  })
};
