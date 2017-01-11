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
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

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
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});
app.get('/home', isLoggedIn, function(req, res) {
  res.render('home');
});
app.get('/profile', isLoggedIn, function(req, res) {
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

app.get('/connect', isLoggedIn, function(req, res) {
  res.render('connect');
});

app.use('/auth', require('./controllers/auth'));
app.use('/posts', require('./controllers/posts'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
