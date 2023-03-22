// to load anything in dotenv in env var
require('dotenv').config();

const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')



connectToMongo();
const app = express()
const port = 3000;

//to use req.body
app.use(express.json());
app.use(cors())

//Available Routes
app.use('/api/createaccount', require('./routes/createaccount'))
app.use('/api/createinvoice', require('./routes/createInvoice'))
app.use('/api/listinvoice', require('./routes/listInvoice'))


app.listen(port, () => {
  console.log(`Invoice backend listening on port http://localhost:${port}`)
})
