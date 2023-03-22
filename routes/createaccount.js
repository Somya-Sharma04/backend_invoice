const express = require('express');
const Account = require('../models/Account');
const router = express.Router();

let accounts = []; 

// endpoint for creating an account
router.post('/', async(req, res) => {
    const { name, balances } = req.body; 
    const account = new Account({ name, balances }); 
    try {
      const savedAccount = await account.save(); 
      res.json({ message: 'Account created successfully', account: savedAccount });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to create account' });
    }
});


module.exports = router