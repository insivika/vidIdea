const express = require('express');
const mongoose = require('mongoose');
const becrypt = require('bcryptjs');
const passport = require('passport')
const router = express.Router();

// Load User model
require('../models/User');
const User = mongoose.model('user');

// User login route
router.get('/login', (req, res) => {
  res.render('users/login')
});



// User register route
router.get('/register', (req, res) => {
  res.render('users/register')
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Register Form
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match '})
  }

  if(req.body.password.length < 4){
    errors.push({text: 'Password must be at least 4 character'})
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password: req.body.password2
    })
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register')
        } else{
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }
      
          becrypt.genSalt(10, (err, salt) => {
            becrypt.hash(newUser.password, salt, (err, hash)=> {
              if(err) throw err;
              newUser.password = hash;
      
              new User(newUser)
                .save()
                .then(user => {
                  req.flash('success_msg', 'You have registered!');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                })
            })
          })
          console.log(newUser)
       }
    });
   }
});

// User logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
})


module.exports = router;