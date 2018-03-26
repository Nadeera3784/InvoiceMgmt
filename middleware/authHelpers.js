// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/login');
}

// Check if user is not logged in
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/dashboard');
}

module.exports = {
  isLoggedIn,
  notLoggedIn,
};
