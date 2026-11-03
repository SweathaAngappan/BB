const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI not set — skipping MongoDB connection (development).');
    return;
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected to:', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.warn('Continuing without DB connection (development).');
  }
};

module.exports = connectDB;

