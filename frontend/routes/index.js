const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const { now } = require('mongoose');
const User = require('../models/user');
const { default: axios } = require('axios');

var store = require('store')

const Student = require('../models/Student');

// const multer  = require('multer')

// const FormData = require('form-data');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })
// var upload = multer({ storage: storage })

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated,(req, res) => {
   
    res.render('dashboard', {
        
    });
    
});


router.get('/viewAttendenceStudent', (req, res) => {

    res.render('viewAttendenceStudent', {})
});

router.get('/teacherDashboard', (req, res) => {

    res.render('teacherDashboard', {})
});


// router.get('/confirmation', (req, res) => {
//     console.log("Hello");
//     res.render('attendanceConfirmation', {})
// });

router.get('/viewAttendenceTeacher', (req, res) => {

    res.render('viewAttendenceTeacher', {})
});

router.post('/foundStudents', (req, res, next) => {
    store.set('student', req.body.number.number);
    
});

router.get('/confirmation', async (req, res, next) => {
    console.log("Redirecting");
    markStudent = req.session;
    console.log(store.get('student'));
    list_of_student = store.get('student');
    final_list = [];
    if(list_of_student){
        for (let i = 0; i < list_of_student.length; i++) {
            Student.find({urn:list_of_student[i]})
            .then((user) => {
                final_list.push(user[0])
                if(final_list.length === list_of_student.length){
                    console.log("final",final_list);
                    res.render('attendanceConfirmation', {final_list:final_list});
                }
            }).catch((err) => {
                console.log(err);
            });
          }
    }
});



module.exports = router;