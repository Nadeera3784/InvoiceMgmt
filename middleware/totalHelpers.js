/* Create array of comany names */
function createName(rsult, req, res, years) {
  const companyNames = new Set();
  let element;
  for (let i = 0; i < rsult.length; i += 1) {
    element = rsult[i].name;
    companyNames.add(element);
  }
  // return { names: Array.from(companyNames), total };
  return res.render('user/dashboard', {
    invoices: rsult,
    invoiceYears: years,
    companies: Array.from(companyNames),
    csrfToken: req.csrfToken(),
  });
}

/* Return Total by Month & Year */
async function sumTotal(Model, data, res, cb) {
  let sum;
  let record;
  // console.log(parseInt(data.year, 10));
  try {
    record = await Model.aggregate([

      {
        $project: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
          grandTotal: 1,
        },
      },
      {
        $match: {
          year: parseInt(data.year, 10),
          month: parseInt(data.month, 10),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grandTotal' },
        },
      },
    ]);
  } catch (err) {
    console.error(err);
  }
  if (record[0] === undefined) {
    return cb('No records found');
  }
  sum = record[0].total;
  return cb(sum);
  // return res.send(JSON.stringify(sum));
}

/* Return Total by Year only */
async function sumYear(Model, data, res, cb) {
  let sum;
  let record;
  // console.log(parseInt(data.year, 10));
  try {
    record = await Model.aggregate([

      {
        $project: {
          year: { $year: '$created_at' },
          grandTotal: 1,
        },
      },
      {
        $match: {
          year: parseInt(data.year, 10),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$grandTotal' },
        },
      },
    ]);
  } catch (err) {
    console.error(err);
  }
  // console.log(record);
  if (record[0] === undefined) {
    return cb('No records found');
  }
  sum = record[0].total;
  return cb(sum);
  // return res.send(JSON.stringify(sum));
}


module.exports = {
  createName,
  sumTotal,
  sumYear,
};
