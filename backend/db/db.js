const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/shareFilesDB');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection failed', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
