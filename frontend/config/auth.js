module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  ensureTeacher: function(req, res, next) {
    // console.log(req.session.passport.user.role);
    if (req.session.passport.user.role==1) {
      return next();
    }
    req.flash('error_msg', 'You are logged in as a Student ');
    res.redirect('/dashboard');
  },
  ensureStudent: function(req, res, next) {
    // console.log(req.session.passport.user.role);
    if (req.session.passport.user.role==0) {
      return next();
    }
    req.flash('error_msg', 'You are logged in as a Teacher ');
    res.redirect('/teacherDashboard');
  },

  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    console.log(req.body,"my Body here _____________________________");
    res.redirect('/dashboard');      
  }
};
