const mongoose = require('mongoose');
const { Schema } = mongoose;

// schema for balance object within account
const balanceSchema = new Schema({
  year: { type: String, required: true },
  balance: { type: Number, required: true }
});

const accountSchema = new Schema({
  name: { type: String, required: true },
  balances: [balanceSchema] 
});


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
