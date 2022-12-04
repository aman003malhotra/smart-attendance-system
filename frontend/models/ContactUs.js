const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  contact: {
    type:String,
  },
  message:{
    type:String
  }
});

const Contact = mongoose.model('contact_form', contactSchema);

module.exports = Contact;
