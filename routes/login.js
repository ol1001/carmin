var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function (app) {

  app.get('/signup', function (req, res) {
    res.render('signup.pug');
  });

  // create new account
  app.post('/signup', function (req, res, next) {
    var email = cleanString(req.param('email'));
    var firstname = cleanString(req.param('firstname'));
    var lastname = cleanString(req.param('lastname'));
    var pass = cleanString(req.param('pass'));
    if (!(email && pass)) {
      return invalid();
    }

    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (user) {
        return res.render('signup.pug', { exists: true });
      }

      crypto.randomBytes(16, function (err, bytes) {
        if (err) return next(err);

        var user = { _id: email, name: { first: firstname, last: lastname } };
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);

        User.create(user, function (err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            } 
            return next(err);
          }

          // user created successfully
          req.session.isLoggedIn = true;
          req.session.user = email;
          console.log('created user: %s', email);
          return res.redirect('/');
        })
      })
    });

    function invalid () {
      return res.render('signup.pug', { invalid: true });
    }
  });

  
  app.get('/login', function (req, res) {
    res.render('login.pug');
  });

  app.post('/login', function (req, res, next) {
    // validate input
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
    if (!(email && pass)) {
      return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    // query mongodb
    User.findById(email, function (err, user) {
      if (err) return next(err);

      if (!user) {
        return invalid();
      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      req.session.isLoggedIn = true;
      req.session.user = email;
      res.redirect('/');
    });

    function invalid () {
      return res.render('login.pug', { invalid: true });
    }
  });

  app.get('/logout', function (req, res) {
    req.session.isLoggedIn = false;
    req.session.user = null;
    res.redirect('/');
  });
};
