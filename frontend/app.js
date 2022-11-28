const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const moment = require("moment");
const axios = require('axios');

var cors = require('cors');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  const store = new MongoDBStore({
    uri: db,
    collection: "mySessions",
  });

app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});
// EJS
// app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

//css static

app.use(express.static('public'));
app.use('/css',express.static(__dirname + '/public'));
app.use('/images',express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname +'/uploads'));

const corsOptions ={
  origin:'http://localhost:5000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions))
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: store
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/index', require('./routes/index.js'));



const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
