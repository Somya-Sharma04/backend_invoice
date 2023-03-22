const express = require('express');
const Invoice = require('../models/Invoice');
const Account = require('../models/Account');

const router = express.Router();


// endpoint for listing invoices
router.get('/', async(req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const searchText = req.query.searchText || '';

  const regex = new RegExp(searchText, 'i');
  

  try {
    const accounts = await Account.find({ name: regex }).lean();
    const customerIds = accounts.map(account => account._id);

    const invoices = await Invoice.find({
      $or: [
        { invoiceNumber: regex },
        { customerId: { $in: customerIds } },
        { amount: { $regex: regex } }
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ message: 'Invoices retrieved successfully', invoices });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to retrieve invoices' });
  }
});





module.exports = router;
