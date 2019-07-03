const express = require('express');

const router = express.Router();

const passport = require('passport');
const mongoose = require('mongoose');

// Import Model(s)
const Invoice = require('../models/invoice');

// Import auth middleware
const auth = require('../middleware/authHelpers');

// Import helper middleware
const { createName, sumTotal, sumYear } = require('../middleware/totalHelpers');

const dash = require('../middleware/userMiddleware');


/* GET home page. */
router.get('/', auth.notLoggedIn, (req, res) => {
  res.render('index', { layout: 'auth' });
});

/* GET home page. */
router.get('/dashboard', auth.isLoggedIn, async (req, res, next) => {
  let years;
  let result;
  try {
    result = await Invoice.find();
    years = await Invoice.aggregate([
      {
        $group:
            {
              _id: { year: { $year: '$created_at' } },
            },
      },
      {
        $sort:
            {
              _id: 1,
            },
      },
    ]);
  } catch (err) {
    next(err);
  }

  return createName(result, req, res, years);
  
});


// Get Invoice Detail View
router.get('/view/:id', auth.isLoggedIn, (req, res, next) => {
  const id = req.params.id;
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
router.post('/search', auth.isLoggedIn, (req, res) => {
  const id = parseInt(req.body.id, 10);
  Invoice.findOne({ invoiceId: id }, (err, result) => {
    if (err) {
      return res.render('user/invView', { layout: 'search', error: err });
    }
    if (result == null) {
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

router.get('/view/:year/:month', auth.isLoggedIn, (req, res, next) => {
 

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
      
      return res.render(
        'user/history',
        {
          invoiceYears: data,
          invoices: result,
          query: `${searchQuery[req.params.month]} ${req.params.year}`,
        },
      );
    });
  });
});


/* Search invoices by year */
router.get('/list/:name', auth.isLoggedIn, (req, res, next) => {
  Invoice.find({ name: req.params.name }, (err, result) => {
    if (err) {
      next(err);
    }
    Invoice.aggregate([
      {
        $group:
            {
              _id: { year: { $year: '$created_at' } },
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
      return res.render(
        'user/list',
        {
          invoiceYears: data,
          invoices: result,
        },
      );
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
router.get('/login', auth.notLoggedIn, (req, res) => {
  const msgs = req.flash('error');
  return res.render('user/login', {
    csrfToken: req.csrfToken(),
    layout: 'auth',
    messages: msgs,
    hasErrors: msgs.length > 0,
  });
});

/* POST login page */
router.post('/login', auth.notLoggedIn, passport.authenticate('local.signin', {
  successRedirect: '/user/dashboard',
  failureRedirect: '/user/login',
  failureFlash: true,
}));

/** Logout  */
router.get('/logout', auth.isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

/** GET Total  */
router.get('/total', auth.isLoggedIn, (req, res) => {
  Invoice.aggregate([
    {
      $group:
          {
            _id: { year: { $year: '$created_at' } },
          },
    },
    {
      $sort:
          {
            _id: 1,
          },
    },
  ], (err, years) => {
    res.render('user/checkTotals', {
      years,
      csrfToken: req.csrfToken(),
    });
  });
});

/** POST Total  */
router.post('/total', auth.isLoggedIn, (req, res, next) => {
  const data = req.body;
  JSON.stringify(data);
  sumTotal(Invoice, data, res, (dataSum) => {
    res.send(JSON.stringify(dataSum));
  });
});

/** POST Total Year  */
router.post('/total/year', auth.isLoggedIn, (req, res, next) => {
  const data = req.body;
  JSON.stringify(data);
  sumYear(Invoice, data, res, (dataSum) => {
    res.send(JSON.stringify(dataSum));
  });
});


module.exports = router;

