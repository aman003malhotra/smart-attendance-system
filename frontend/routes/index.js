const express = require('express');
const router = express.Router();

const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated,ensureTeacher, ensureStudent } = require('../config/auth');

const { now } = require('mongoose');
const User = require('../models/user');
const { default: axios } = require('axios');

var store = require('store')

const Student = require('../models/Student');

const StudentAttendance = require('../models/StudentAttendance');


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
router.get('/dashboard', ensureAuthenticated,ensureStudent,(req, res) => {
    user_id = req.session.passport.user._id;
    res.render('dashboard', {
        
    });
    
});


router.get('/viewAttendenceStudent',ensureAuthenticated,ensureStudent, (req, res) => {

    res.render('viewAttendenceStudent', {})
});

router.get('/teacherDashboard', ensureAuthenticated,ensureTeacher,(req, res) => {

    res.render('teacherDashboard', {})
});


// router.get('/confirmation', (req, res) => {
//     console.log("Hello");
//     res.render('attendanceConfirmation', {})
// });

router.get('/viewAttendenceTeacher',ensureAuthenticated,ensureTeacher, (req, res) => {

    res.render('viewAttendenceTeacher', {})
});
router.get('/markAttendence',ensureAuthenticated,ensureTeacher, (req, res) => {

    res.render('markAttendence', {})
});

router.post('/foundStudents',ensureAuthenticated,ensureTeacher, (req, res, next) => {
    store.set('student', req.body.number.number);
    
});

router.get('/confirmation',ensureAuthenticated,ensureTeacher, async (req, res, next) => {
    console.log("Redirecting");
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



router.post('/finalConfirmation',ensureAuthenticated,ensureTeacher,  (req, res, next) => {
    console.log("Final Confirmation");
    console.log(store.get('student'));
    const current_date = new Date();
        list_of_student = store.get('student');
    if(list_of_student){
        for (let i = 0; i < list_of_student.length; i++) {
            Student.find({urn:list_of_student[i]})
            .then((user) => {
                const newAttendance = new StudentAttendance({
                    teacherName:"kapil",
                    subject_code: user[0].subject_code,
                    studenturn:user[0].urn,
                    date:current_date,
                    slot:2,
                    branch:user[0].branch});
                
                newAttendance
                .save()
                .then((data)=>{
                    console.log("saved")
                })
                .catch(err => {
                    console.log(err)
                })
            }).then(() => {

                // ADDING REDIRECTION
                
                res.redirect('/markAttendence')
            }).catch((err) => {
                console.log(err);
            });
          }
    }
});



module.exports = router;