const express = require('express');

const router = express.Router();

const csurf = require('csurf');

const csrfProtect = csurf();

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()){
//     return next();
//   }
//   return res.redirect('/user/login');
// }


function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/dashboard');
}


router.use(csrfProtect);

/* GET home page. */
router.get('/', notLoggedIn, (req, res) => {
  res.render('index', { layout: 'auth' });
});


module.exports = router;
