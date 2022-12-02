const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'))  

// Register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                var role = 0;
                const newUser = new User({
                    role,
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: true,
    }), (req, res, next) => {

        if (req.user.role === 1) {
            res.redirect('/teacherDashboard');
        }
        if (req.user.role === 0) {
            res.redirect('/dashboard');
        }
    });
// router.post('/login',
//   passport.authenticate('local', {
//     failureRedirect: '/users/login',
//     failureFlash: true,
//   }), async(req, res) => {
//     var allUsers = await User.find({}).exec() ;
//     console.log(req.user,"user----------------------")
//     if (req.user.role === 1) {
//       res.render('adminPanel',{
//         name:req.user.name,
//         email:req.user.email,
//         user:allUsers
//       });       
//     }
//     if (req.user.role === 0) {
//       res.redirect('/dashboard');
//     }
//   }); 
// router.post('/login', (req, res, next) => {


//   console.log("my login- ",req.body)
//   passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true,

//   })(req, res, next);
// });

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    req.session.destroy();
    res.redirect('/users/login');
});

module.exports = router;