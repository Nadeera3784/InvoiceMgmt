// Import Model(s)
// const Invoice = require('../models/invoice');


// MiddleWare for invoice creation
const createInvoice = {
  get: (req, res, token) => {
    res.render('user/createInvoice', { csrfToken: token });
  },
  post: (req, res, Invoice) => {
    const data = req.body;
    JSON.stringify(data);

    const invoice = new Invoice({
      name: data.name,
      subTotal: data.subTotal,
      grandTotal: parseInt(data.grandTotal, 10),
      vat: data.vat,
      created_by: req.user.username,
      date: data.date,
    });
    for (let i = 0; i < data.desc.length; i += 1) {
      invoice.description.push({ value: data.desc[i] });
      invoice.quantity.push({ value: data.qty[i] });
      invoice.remarks.push({ value: data.remarks[i] });
      invoice.cost.push({ value: data.cost[i] });
    }

    invoice.save().then(() => {
      res.send(JSON.stringify('Invoice Created'));
    }).catch((err) => {
      res.send(err);
    });
  },
};

module.exports = createInvoice;
