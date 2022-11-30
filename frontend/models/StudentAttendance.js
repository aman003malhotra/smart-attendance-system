const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
  teacherName: {
    type: String,
  },
  studenturn: {
    type: String,
  },
  subject_code: {
    type: String,
  },
  slot: {
    type:Number,
  },
  branch:{
    type:String
  },
});

const StudentAttendance = mongoose.model('student_attendance', StudentAttendanceSchema);

module.exports = StudentAttendance;
