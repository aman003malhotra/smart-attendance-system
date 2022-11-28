const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const { now } = require('mongoose');
const User = require('../models/user');
const { default: axios } = require('axios');
const multer  = require('multer')

const FormData = require('form-data');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

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


// router.post('/post-image-data',upload.single('image'), async (req, res) => {
//     api_url = 'http://127.0.0.1:5000/predict'
//     console.log(req.file);
//     const formData = new FormData();
//     formData.append("image", req.file);
//     await axios.post(api_url, req.file, {
//         headers:{
//             'accept': 'application/json',
//             'Accept-Language': 'en-US,en;q=0.8',
//             'Content-Type': `multipart/form-data`,
//         }
//     }).then((response) => {
//         console.log(response)
//     }).catch((error) =>{
//         console.log(error);
//     });
// })

router.get('/admin', async(req, res) => {
    
    res.render('adminPanel', {
       

    })
});



module.exports = router;