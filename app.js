
var mongoose = require('mongoose');
var express = require('express');

// add mongoose query and promise support to express
require('express-mongoose');

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/blog', function (err) {
  if (err) throw err;

  var app = express(); //create http-server
  app.set('view engine', 'pug');
  middleware(app);
  routes(app);

  app.listen(8300, function () {
    console.log('now listening on http://localhost:8300');
  });
});
