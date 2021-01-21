require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const app = express();


app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(helmet);

app.use(session({ //because of how this works, we have access to this session on ANY request
  secret: process.env.SESSION_SECRET, //should be an ENV variable
  resave: false, //forces resaving of the session when things have changed
  saveUninitialized: true //stores the session even if we don't have anything saved
}));

//Init passport config must happen AFTER session config
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //must happen after session config but before you try to use it

//write custom middleware to access the user on every response
app.use((req, res, next) => {
  let alerts = req.flash();
  console.log(alerts);
  res.locals.alerts = alerts;
  res.locals.currentUser = req.user;
  next();
})

app.get('/', (req, res) => {
  req.session.testVar = "FIRE";
  res.render('index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  //console.log(req.session.testVar);
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));
//app.use('/dino', isLoggedIn, require('./routes/dino')); //this auth locks an entire route

var server = app.listen(process.env.PORT || 3000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 3000}🎧`));

module.exports = server;
