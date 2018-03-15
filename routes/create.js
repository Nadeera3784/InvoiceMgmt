const express = require('express');

const router = express.Router();

// Import Model(s)
const Invoice = require('../models/invoice');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/login');
}

/* Get CreateInvoice Page */
router.get('/', isLoggedIn, (req, res) => {
  res.render('user/createInvoice', { csrfToken: req.csrfToken() });
});

/* Post CreateInvoice Page */
router.post('/', isLoggedIn, (req, res) => {
  const data = req.body;
  // console.log(data);
  JSON.stringify(data);
  // console.log(data.desc);

  const invoice = new Invoice({
    name: data.name,
    subTotal: data.subTotal,
    grandTotal: data.grandTotal,
    vat: data.vat,
    created_by: req.user.username,
    date: data.date,
  });

  for (let i = 0; i < data.desc.length; i += 1) {
    invoice.description.push({ value: data.desc[i] });
    invoice.quantity.push({ value: data.qty[i] });
    invoice.remarks.push({ value: data.remarks[i] });
    invoice.cost.push({ value: data.cost[i] });
    // console.log(invoice.description[i]);
  }
  // console.log(invoice);
  invoice.save((err) => {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify('Invoice Created'));
  });
});


module.exports = router;
