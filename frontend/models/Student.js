const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  urn: {
    type: String,
  },
  email: {
    type: String,
  },
  contact: {
    type:String,
  },
  branch:{
    type:String
  },
  semester:{
    type:String
  },
  subject_code:{
    type:Array
  }
});

const Student = mongoose.model('student_database', StudentSchema);

module.exports = Student;
