const express = require('express');

const router = express.Router();

// Import Model(s)
const Invoice = require('../models/invoice');
// Import Controller
const  create = require('../controllers/createController');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/login');
}

/* Get CreateInvoice Page */
router.get('/', isLoggedIn, (req, res) => {
  const csrfToken = req.csrfToken();
  create.get(req, res, csrfToken);
});

/* Post CreateInvoice Page */
router.post('/', isLoggedIn, (req, res) => {
  create.post(req, res, Invoice);
});


module.exports = router;
