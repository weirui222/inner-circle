var express = require('express');
var db = require('../models');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var async = require('async');

router.get('/', isLoggedIn, function(req, res) {
  // console.log('req.user.id',req.user.id);
  db.post.findAll({
    where: {
      userId: req.user.id,
      isPublic: true
    },
    order: '"createdAt" DESC'
  }).then(function(posts){
    // console.log('POST', posts);
    res.render('profile',{ posts:posts });
  });
});

// create new post
router.get('/new', isLoggedIn, function(req, res) {
  res.render('post/new');
});

router.post('/public', function(req, res) {
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    isPublic: true
  })
  .then(function(post) {
        res.redirect('/posts');
    })
  .catch(function(error) {
    res.status(400).render('404');
  });
});

router.post('/save', function(req, res) {
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    isPublic: false
  })
  .then(function(post) {
        res.redirect('/posts/draft');
    })
  .catch(function(error) {
    res.status(400).render('404');
  });
});

// go to draft to see draft list
router.get('/draft', isLoggedIn, function(req, res) {
  // console.log('req.user.id',req.user.id);
  db.post.findAll({
    where: {
      userId: req.user.id,
      isPublic: false
    },
    order: '"createdAt" DESC'
  }).then(function(posts){
    // console.log('POST', posts);
    res.render('post/draft',{ posts:posts });
  });
});

// go to one post
router.get('/post/:id', isLoggedIn, function(req, res) {
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

// Delete
router.delete('/delete/:id', function(req, res) {
  db.post.findById(req.params.id).then(function(post){
     post.destroy();
     res.send(req.body);
  });
});

module.exports = router;
