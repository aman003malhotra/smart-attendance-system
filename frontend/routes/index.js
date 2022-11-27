const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const { now } = require('mongoose');
const User = require('../models/user');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) => {
   
    res.render('dashboard', {
        
    });
    
});


router.get('/viewAttendenceStudent', (req, res) => {

    res.render('viewAttendenceStudent', {})
});

router.get('/teacherDashboard', (req, res) => {

    res.render('teacherDashboard', {})
});

router.get('/viewAttendenceTeacher', (req, res) => {

    res.render('viewAttendenceTeacher', {})
});

router.get('/admin', async(req, res) => {
    
    res.render('adminPanel', {
       

    })
});



module.exports = router;