// to get connect with our mongoose 

const mongoose = require('mongoose');
const mongoURI = process.env.URL;

const connectToMongo = async()=>{
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Successfully');
      } catch (error) {
        console.error(error);
        throw new Error('Error connecting to MongoDB');
      }
}

module.exports = connectToMongo;
