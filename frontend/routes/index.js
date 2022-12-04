const express = require('express');
const router = express.Router();

const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated, ensureTeacher, ensureStudent } = require('../config/auth');
const url = require('url');
const { now } = require('mongoose');
const User = require('../models/user');
const { default: axios } = require('axios');

var store = require('store')
var nodemailer = require('nodemailer');
const twilio = require('twilio')
const Student = require('../models/Student');
const Subject = require('../models/Subject');

const StudentAttendance = require('../models/StudentAttendance');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Student Dashboard
router.get('/student-dashboard', ensureAuthenticated, ensureStudent, (req, res) => {
    student_name = req.session.passport.user.name;
    subject_list = []
    Student.find({ name: student_name })
        .then((student_info) => {
            student_info[0].subject_code.forEach(element => {
                Subject.find({ subject_code: element })
                    .then((subject) => {
                        subject_list.push(subject[0])
                        if (student_info[0].subject_code.length === subject_list.length) {
                            res.render('studentDashboard', { subject_list: subject_list });
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


router.get('/viewAttendenceStudent', ensureAuthenticated, ensureStudent, (req, res) => {

    res.render('viewAttendenceStudent', {})
});

router.get('/aboutUs', (req, res) => {

    res.render('aboutUs', {})
});

router.get('/contactUs', (req, res) => {

    res.render('contactUs', {})
});

router.get('/teacherDashboard', ensureAuthenticated, ensureTeacher, (req, res) => {
    teacher_name = req.session.passport.user.name;
    Subject.find({ subject_teacher: teacher_name })
        .then((teacher_data) => {
            res.render('teacherDashboard', { teacher_data: teacher_data });
            console.log(teacher_data)
        }).catch((err) => {
            console.log(err);
        })
});

router.get('/all-student', ensureAuthenticated, (req, res) => {
    Student.find({})
        .then((students) => {
            res.render('allStudentsInfo', { students: students });
        }).catch((err) => {
            console.log(err);
        })
});


router.get('/viewAttendenceTeacher', ensureAuthenticated, ensureTeacher, (req, res) => {
    StudentAttendance.find({ date: req.query.date, session: req.query.session })
        .then((result) => {
            console.log(result)
            res.render('viewAttendenceTeacher', { list: result })
        })

});


router.get('/view-attendance-slot', (req, res) => {
    res.render('selectAttendenceSlot')
});

router.post('/view-attendance-slot', (req, res) => {

    res.redirect(url.format({
        pathname: "/viewAttendenceTeacher",
        query: {
            "session": req.body.session,
            "date": req.body.date
        }
    }));
});



router.get('/create-session', (req, res) => {
    res.render('selectSession')
})

router.post('/store-session', (req, res) => {
    console.log(req.body)
    var today = new Date().toISOString().split('T')[0];
    var subjectCode;
    Subject.find({ subject_teacher: req.session.passport.user.name }).then((chosen_subject) => {
        subjectCode = chosen_subject[0].subject_code;
        Student.find({ subject_code: { "$in": [subjectCode] } }).then((found_student) => {
            for (let index = 0; index < found_student.length; index++) {
                const studentAttendanceObject = new StudentAttendance({
                    teacherName: req.session.passport.user.name,
                    studentName: found_student[index].name,
                    studenturn: found_student[index].urn,
                    subject_code: subjectCode,
                    session: req.body.session,
                    date: today,
                    attendance_status: '0',
                    branch: found_student[index].branch,
                })
                studentAttendanceObject.save().then(() => {
                    console.log("attendence saved")
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    })

    res.redirect('/markAttendence')
})

router.get('/markAttendence', ensureAuthenticated, ensureTeacher, (req, res) => {
    
    res.render('markAttendence', {})
});

router.post('/foundStudents', ensureAuthenticated, ensureTeacher, (req, res, next) => {
    store.clearAll();
    store.set('student', req.body.number.number);

});

router.get('/confirmation', ensureAuthenticated, ensureTeacher, async (req, res, next) => {
    console.log("Redirecting");
    console.log(store.get('student'));
    list_of_student = store.get('student');
    final_list = [];
    if (list_of_student) {
        for (let i = 0; i < list_of_student.length; i++) {
            Student.find({ urn: list_of_student[i] })
                .then((user) => {
                    final_list.push(user[0])
                    if (final_list.length === list_of_student.length) {
                        console.log("final", final_list);
                        res.render('attendanceConfirmation', { final_list: final_list });
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    }
});



router.post('/finalConfirmation', ensureAuthenticated, ensureTeacher, async (req, res, next) => {
    console.log("Final Confirmation");
    console.log(store.get('student'));
    const current_date = new Date();
    var count = 0;
    list_of_student = store.get('student');
    if (list_of_student) {
        for (let i = 0; i < list_of_student.length; i++) {
            Student.find({ urn: list_of_student[i] })
                .then((user) => {
                    StudentAttendance.updateOne({studenturn:user[0].urn}, 
                        {attendance_status:"1"}, function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else{
                            console.log("Updated Docs : ", docs);
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                }).then(()=>{
                    count = count+1;
                    if(count == list_of_student.length){
                        res.redirect('/markAttendence')
                    }
                })
                
        }
    }
});



module.exports = router;