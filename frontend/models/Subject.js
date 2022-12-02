const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subject_code: {
    type: String,
  },
  subject_name: {
    type: String,
  },
  subject_teacher: {
    type: String,
  },
  credits: {
    type:Number,
  },
  branch: {
    type:String,
  }
});

const Subject = mongoose.model('subject_table', SubjectSchema);

module.exports = Subject;
