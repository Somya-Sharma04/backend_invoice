// Require Mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;

//schema for the Invoice model
const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  accountArray: [{
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: String,
    required: true
  }
});

invoiceSchema.pre('save', async function (next) {
  try {
    const year = this.year;
    for (let i = 0; i < this.accountArray.length; i++) {
      const accountId = this.accountArray[i].accountId;
      const amount = this.accountArray[i].amount;
      await mongoose.model('Account').updateOne(
        { _id: accountId, balances: { $elemMatch: { year: year } } },
        { $inc: { 'balances.$.balance': amount } }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
