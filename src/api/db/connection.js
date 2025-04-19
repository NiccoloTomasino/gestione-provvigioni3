const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connesso con successo');
    return true;
  } catch (error) {
    console.error('Errore di connessione a MongoDB:', error.message);
    return false;
  }
};

module.exports = connectDB;
