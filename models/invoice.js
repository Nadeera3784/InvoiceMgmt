const mongoose = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

const Schema  = mongoose.Schema;

// Sub Documents
const itemSchema = new Schema({
  value: 'string',
});

const schema = new Schema({
  name: 'String',
  created_by: 'String',
  subTotal: 'String',
  grandTotal: 'String',
  vat: 'String',
  description: [itemSchema],
  quantity: [itemSchema],
  remarks: [itemSchema],
  cost: [itemSchema],
  date: 'String',
  created_at: { type: Date, default: Date.now },
});

schema.plugin(autoIncrement.plugin, { model: 'Invoice', field: 'invoiceId', startAt: 1 });

module.exports = mongoose.model('Invoice', schema);
