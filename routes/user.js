const express = require('express');

const router = express.Router();
// const csurf = require('csurf');

const passport = require('passport');
const mongoose = require('mongoose');

// Import Model(s)
const Invoice = require('../models/invoice');

function createName(rsult) {
  const companyNames = [];
  let element;
  for (let i = 0; i < rsult.length; i += 1) {
    element = rsult[i].name.toUpperCase();
    if (companyNames[i] === undefined) {
      companyNames.push(element);
    }
    if (i > 0) {
      if (companyNames.indexOf(element < 0)) {
        companyNames.push(element);
      }
    }
  }
  return companyNames;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/login');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/dashboard');
}


/* GET home page. */
router.get('/', notLoggedIn, (req, res) => {
  res.render('index', { layout: 'auth' });
});

/* GET home page. */
router.get('/dashboard', isLoggedIn, (req, res, next) => {
  Invoice.aggregate([
    {
      $group:
          {
            _id: { year: { $year: '$created_at' } },
            // invoiceID: { $addToSet: "$_id" }
          },
    },
    {
      $sort:
          {
            _id: 1,
          },
    },
  ], (err, years) => {
    if (err) {
      next(err);
    }
    Invoice.find((error, result) => {
      if (error) {
        next(error);
      }
      const names = createName(result);
      // console.log(result);
      return res.render('user/dashboard', {
        invoices: result,
        invoiceYears: years,
        companies: names,
        csrfToken: req.csrfToken(),
      });
    });
  });
});

// router.use(csrfProtect);


// Get Invoice Detail View
router.get('/view/:id', isLoggedIn, (req, res, next) => {
  const { id } = req.params.id;
  Invoice.findById(mongoose.Types.ObjectId(id), (err, result) => {
    if (err) {
      return next(err);
    }

    const resultArr = [];
    for (let i = 0; i < result.description.length; i += 1) {
      resultArr[i] = {
        item: result.description[i].value,
        quantity: result.quantity[i].value,
        cost: result.cost[i].value,
        remarks: result.remarks[i].value,
      };
    }
    // console.log(resultArr);
    // created_at: 'String'
    return res.render(
      'user/invView',
      {
        invoice: {
          result: resultArr,
          name: result.name,
          invoiceNo: result.invoiceId,
          creator: result.created_by,
          vat: result.vat,
          subTotal: result.subTotal,
          grandTotal: result.grandTotal,
          date: result.date,
        },
        layout: 'view',
      },
    );
  });
});


// Search Invoice Detail View
router.post('/search', isLoggedIn, (req, res) => {
  const id = parseInt(req.body.id, 10);
  // console.log(id);
  Invoice.findOne({ invoiceId: id }, (err, result) => {
    if (err) {
      // return console.log(err);
      return res.render('user/invView', { layout: 'search', error: err });
    }
    if (result == null) {
      // console.log(result);
      return res.render('user/invView', { layout: 'search', error: 'Invoice not Found' });
    }
    if (result != null) {
      const resultArr = [];
      for (let i = 0; i < result.description.length; i += 1) {
        resultArr[i] = {
          item: result.description[i].value,
          quantity: result.quantity[i].value,
          cost: result.cost[i].value,
          remarks: result.remarks[i].value,
        };
      }
      // created_at: 'String'

      res.render(
        'user/invView',
        {
          invoice: {
            result: resultArr,
            name: result.name,
            invoiceNo: result.invoiceId,
            creator: result.created_by,
            vat: result.vat,
            subTotal: result.subTotal,
            grandTotal: result.grandTotal,
            date: result.date,
          },
          layout: 'view',
        },
      );
    }
  });
});

router.get('/view/:year/:month', isLoggedIn, (req, res, next) => {
  // var year = req.params.year;
  // var month = req.params.month;

  const searchQuery = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  Invoice.aggregate([

    {
      $project: {
        year: { $year: '$created_at' },
        month: { $month: '$created_at' },
        document: '$$ROOT',
      },
    },
    {
      $match: {
        year: parseInt(req.params.year, 10),
        month: parseInt(req.params.month, 10),
      },
    },

  ], (err, result) => {
    if (err) {
      next(err);
    }

    Invoice.aggregate([
      {
        $group:
            {
              _id: { year: { $year: '$created_at' } },
              // invoiceID: { $addToSet: "$_id" }
            },
      },
      {
        $sort:
            {
              _id: 1,
            },
      },

    ], (error, data) => {
      if (error) {
        next(error);
      }

      // console.log(data);
      // console.log(result);
      return res.render('user/history', { invoiceYears: data, invoices: result, query: `${searchQuery[req.params.month]} ${req.params.year}` });
    });
  });
});

/* GET signup page */
router.get('/signup', (req, res) => {
  const msgs = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    layout: 'auth',
    messages: msgs,
    hasErrors: msgs.length > 0,
  });
});


/* POST signup page */
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/login',
  failureRedirect: '/user/signup',
  failureFlash: true,
}));


/* GET login page */
router.get('/login', notLoggedIn, (req, res) => {
  const msgs = req.flash('error');
  return res.render('user/login', {
    csrfToken: req.csrfToken(),
    layout: 'auth',
    messages: msgs,
    hasErrors: msgs.length > 0,
  });
});

/* POST login page */
router.post('/login', notLoggedIn, passport.authenticate('local.signin', {
  successRedirect: '/user/dashboard',
  failureRedirect: '/user/login',
  failureFlash: true,
}));

/** Logout  */
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

