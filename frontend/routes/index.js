const express = require('express');
const router = express.Router();

const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated,ensureTeacher, ensureStudent } = require('../config/auth');

const { now } = require('mongoose');
const User = require('../models/user');
const { default: axios } = require('axios');

var store = require('store')

const Student = require('../models/Student');
const Subject = require('../models/Subject');
const StudentAttendance = require('../models/StudentAttendance');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/student-dashboard', ensureAuthenticated,ensureStudent,(req, res) => {
    student_name = req.session.passport.user.name;
    subject_list = []
    Student.find({name:student_name})
    .then((student_info) => {
        student_info[0].subject_code.forEach(element => {
            Subject.find({subject_code:element})
            .then((subject) => {
                subject_list.push(subject[0])
                if(student_info[0].subject_code.length === subject_list.length){
                    res.render('studentDashboard', {subject_list:subject_list});
                    console.log(subject_list)
                }
            }).catch(err => {
                console.log(err);
            })
        });
    })
    .catch((err) => {
        console.log(err)
    })
});


router.get('/viewAttendenceStudent',ensureAuthenticated,ensureStudent, (req, res) => {

    res.render('viewAttendenceStudent', {})
});

router.get('/teacherDashboard', ensureAuthenticated,ensureTeacher,(req, res) => {

    res.render('teacherDashboard', {})
});

router.get('/all-student',ensureAuthenticated, (req, res) => {
    Student.find({})
    .then((students)=>{
        res.render('allStudentsInfo', {students:students});
    }).catch((err) => {
        console.log(err);
    })
});

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