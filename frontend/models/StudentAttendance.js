const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
  teacherName: {
    type: String
  },
  studenturn: {
    type: String
  },
  studentName:{
    type:String
  },
  subject_code: {
    type: String
  },
  session: {
    type:Number
  },
  date: {
    type:String
  },
  attendance_status:{
    type:String
  },
  branch:{
    type:String
  },
});

const StudentAttendance = mongoose.model('student_attendance', StudentAttendanceSchema);

module.exports = StudentAttendance;
