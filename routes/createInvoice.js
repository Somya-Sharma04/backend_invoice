const express = require('express');
const Invoice = require('../models/Invoice');
const Account = require('../models/Account');

const router = express.Router();

// Route for creating a new invoice
router.post('/', async (req, res) => {
  try {
    const { date, customerId, accountArray, totalAmount, invoiceNumber, year } = req.body;
    
    if (accountArray.length === 0) {
      return res.status(400).json({ message: 'Account array cannot be empty' });
    }

    const accountIds = accountArray.map(account => account.accountId);
    const accounts = await Account.find({ _id: { $in: accountIds } });

    const accountTotal = accountArray.reduce((total, account) => {
      const { accountId, amount } = account;
      const matchedAccount = accounts.find(acc => acc._id.equals(accountId));
      return total + amount;
    }, 0);

    if (accountTotal !== totalAmount) {
      return res.status(400).json({ message: 'Account array total does not match invoice total' });
    }

    const validAccountIds = accounts.map(account => account._id.toString());
    const invalidAccountIds = accountIds.filter(id => !validAccountIds.includes(id));

    if (invalidAccountIds.length > 0) {
      return res.status(400).json({ message: `Invalid account ids: ${invalidAccountIds.join(', ')}` });
    }

    const existingInvoice = await Invoice.findOne({ year, invoiceNumber });

    if (existingInvoice) {
      return res.status(400).json({ message: `Invoice ${invoiceNumber} already exists for year ${year}` });
    }

    const invoice = new Invoice({
      date,
      customerId,
      accountArray,
      totalAmount,
      invoiceNumber,
      year
    });

    await invoice.save();

    res.json({ message: 'Invoice created successfully', invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});

module.exports = router;
