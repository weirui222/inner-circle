var express = require('express');
var db = require('../models');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var async = require('async');

router.post('/', isLoggedIn, function(req, res) {
// A few basic validations
  if (!req.body.title || req.body.title.length < 2) {
    res.send('Error: Please include a title containing at least 3 letters.');
  }
  if (!req.body.content || req.body.content.trim().length < 5) {
    res.send('Error: Please include a valid content section.');
  }
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
  })
  .then(function(post) {
        res.redirect('/profile');
    })
  .catch(function(error) {
    res.status(400).render('404');
  });
});

router.get('/new', isLoggedIn, function(req, res) {
  res.render('post/new');
});

router.get('/:id', isLoggedIn, function(req, res) {
  db.post.find({
    where: { id: req.params.id },
  })
  .then(function(post) {
    if (!post) throw Error();
    res.render('post/show', { post: post });
  })
  .catch(function(error) {
    res.status(400).render('404');
  });
});

module.exports = router;
