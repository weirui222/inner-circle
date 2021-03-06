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
  }).then(function(posts) {
    db.post.findAll({
      where: {
        userId: req.user.id,
        isPublic: false
      },
      order: '"createdAt" DESC'
    }).then(function(drafts) {
      // console.log('POST', posts);
      res.render('profile', { posts: posts, drafts: drafts });
    });
  });
});

// create new post
router.get('/new', isLoggedIn, function(req, res) {
  res.render('post/new');
});

router.post('/public', isLoggedIn, function(req, res) {
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    isPublic: true,
    url: req.body.url
  })
  .then(function(post) {
    res.redirect('/posts');
  })
  .catch(function(error) {
    console.log('error', error);
    res.status(400).render('404');
  });
});

router.post('/save', isLoggedIn, function(req, res) {
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id,
    isPublic: false,
    url: req.body.url
  })
  .then(function(post) {
    res.redirect('/posts');
  })
  .catch(function(error) {
    res.status(400).render('404');
  });
});

// go to one post
router.get('/post/:id', isLoggedIn, function(req, res) {
  db.post.find({
    where: { id: req.params.id }
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
router.delete('/delete/:id', isLoggedIn, function(req, res) {
  db.post.findById(req.params.id).then(function(post) {
    post.destroy();
    res.send(req.body);
  });
});

// edit
router.get('/edit/:id', isLoggedIn, function(req, res) {
  db.post.findById(req.params.id).then(function(post) {
    res.render('post/edit', { post: post });
  });
});

router.post('/edit/public/:id', isLoggedIn, function(req, res) {
  db.post.findById(req.params.id).then(function(post) {
    post.update({
      title: req.body.title,
      content: req.body.content,
      isPublic: true,
      url: req.body.url
    })
    .then(function() {
      res.redirect('/posts');
    })
    .catch(function(error) {
      res.status(400).render('404');
    });
  });
});
router.post('/edit/save/:id', isLoggedIn, function(req, res) {
  db.post.findById(req.params.id).then(function(post) {
    post.update({
      title: req.body.title,
      content: req.body.content,
      isPublic: false,
      url: req.body.url
    })
    .then(function() {
      res.redirect('/posts');
    })
    .catch(function(error) {
      res.status(400).render('404');
    });
  });
});

module.exports = router;
