require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

console.log('Connecting to MongoDB');
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = mongoose;