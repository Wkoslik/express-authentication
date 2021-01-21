const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

//sign up POST route
router.post('/signup', (req, res) =>{
  //res.send(req.body);
  //findOrCreate a new user based on email
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) =>{
    if (created){
      //if the user was created
      //redirect to homepage or profile
      console.log(`${user.name} was CREATED`);
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Welcome to this app' //sent to the user so they know whats going on
      })(req, res);//iif? have to call it immediately (immediately invoked function)
  } else {
    // else (user wasn't created/user was found and cannot sign up)
      //redirect to the /auth/signup
    console.log(`${user.name} was FOUND`);
    req.flash('error', 'Email already exists');
    res.redirect('/auth/signup');
  }

  }).catch(err =>{
      //if there is an error it's probably a validation error so we will return to /auth/signup
    console.log('BAD NEWS BEARS THERE WAS AN ERROR');
    console.log(err);
    req.flash('error', err.message);
    res.redirect('/auth/signup');
  })
})

router.get('/login', (req, res) => {
  res.render('auth/login', { alerts: req.flash() });
});


//make passport do the log in stuff
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  successRedirect: '/',
  failureFlash: 'Invalid Log in credentials',
  successFlash: 'Successful log in'
}))

//logout route
router.get('/logout', (req,res) =>{
  req.logout();
  res.redirect('/');
  req.flash('Success', 'Thanks! See ya soon!');
})

module.exports = router;
