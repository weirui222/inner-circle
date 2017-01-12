require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var db = require('./models');
var moment = require('moment');
var path = require('path');
var request = require('request');
var marked = require('marked');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(__dirname + '/node_modules/marked'));
app.use(express.static(__dirname + '/node_modules/bootstrap-markdown'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretpassword',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.moment = moment;
  res.locals.marked = marked;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});
app.get('/home', isLoggedIn, function(req, res) {
  var redditUrl = 'https://www.reddit.com/hot.json';
  request(redditUrl, function(error, response, body) {
    var reddits = JSON.parse(body).data.children;
    db.user.findById(req.user.id).then(function(user) {
      user.getFriends({
        include: [db.post]
      }).then(function(friends) {
        // console.log('friends', friends);
        // console.log('friends[0].posts', friends[0].posts);
        var friendPosts = [];
        for (var i = 0; i < friends.length; i++) {
          for (var j = 0; j < friends[i].posts.length; j++) {
            if (friends[i].posts[j].dataValues.isPublic === true) {
              friendPosts.push({
                user: friends[i],
                post: friends[i].posts[j]
              });
            }
          }
        }
        friendPosts.sort(function(a, b) {
          if (a.post.createdAt === b.post.createdAt) {
            return 0;
          } else if (a.post.createdAt > b.post.createdAt) {
            return -1;
          } else {
            return 1;
          }
        });
        res.render('home', { reddits: reddits, friendPosts: friendPosts });
      });
    });
  });
});
app.get('/share', isLoggedIn, function(req, res) {
  res.render('share', {
    title: req.query.title,
    url: req.query.url,
    authorTitle: req.query.authorTitle
  });
});


app.get('/connect', isLoggedIn, function(req, res) {
  var potentialFriends = [];
  db.user.findById(req.user.id).then(function(friend) {
    friend.getFriends().then(function(friends) {
      // console.log('Friends', friends);
      db.user.findAll().then(function(allusers) {
        // console.log('allusers', allusers);
        for (var i = 0; i < allusers.length; i++) {
          if (friends.length !== 0) {
            for (var j = 0; j < friends.length; j++) {
              if (allusers[i].dataValues.id === friends[j].dataValues.id) {
                // console.log('break allusers[i]', allusers[i].dataValues.id);
                break;
              }
              if ((j === friends.length - 1) && allusers[i].dataValues.id !== req.user.id) {
                potentialFriends.push(allusers[i]);
                // console.log('push allusers[i]', allusers[i].dataValues.id);
                // console.log('potentialFriends', potentialFriends);
              }
            }
          } else {
            potentialFriends.push(allusers[i]);
          }
        }
        console.log('potentialFriends', potentialFriends);
        res.render('connect', { friends: friends, potentialFriends: potentialFriends });
      });
    });
  });
});

app.post('/addfriend', isLoggedIn, function(req, res) {
  // console.log('req.user.id ', req.user.id);
  // console.log('req.body', req.body.friendId);
  db.user.find({ where: { id: req.user.id } }).then(function(user1) {
    db.user.find({ where: { id: req.body.friendId } }).then(function(user2) {
      // console.log('users:', user1, user2);
      user1.addFriend(user2).then(function() {
        user2.addFriend(user1).then(function() {
          res.redirect('/connect');
        });
      });
    });
  });
});

app.use('/auth', require('./controllers/auth'));
app.use('/posts', require('./controllers/posts'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
