var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      passport.authenticate('local', {
        successRedirect: '/home',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      req.flash('error', 'Email already exists. Sign up with another email/ Log in');
      res.redirect('/');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/');
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/',
  successFlash: 'Logged In!',
  failureFlash: 'Invalid username and/or password'
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged Out!');
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: 'An error occurred, please try later',
  successFlash: 'You have logged in with Facebook'
}));

module.exports = router;
