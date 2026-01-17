const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Only connect if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MongoDB URI not provided. Running without database.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit process - allow app to run without database
    console.log('⚠️  Continuing without database connection...');
  }
};

module.exports = connectDB;
