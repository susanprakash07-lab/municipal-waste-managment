const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  // If connection is already open, reuse it immediately (crucial for serverless lambdas)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const isVercel = Boolean(process.env.VERCEL);
  const uri = process.env.MONGO_URI;

  if (isVercel && (!uri || uri.includes('127.0.0.1') || uri.includes('localhost'))) {
    console.warn('⚠️ Localhost/Missing MONGO_URI on Vercel. Running in instant cloud demo mode.');
    return null;
  }

  const finalUri = uri || 'mongodb://127.0.0.1:27017/municipal_waste_management';

  cachedPromise = (async () => {
    try {
      const conn = await mongoose.connect(finalUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      cachedConnection = conn;

      // Auto-seed if database has 0 users
      try {
        const User = require('../models/User');
        const count = await User.countDocuments();
        if (count === 0) {
          console.log('🌱 Database is empty. Seeding initial municipal demo data...');
          const { seedDatabase } = require('../seed/seedData');
          await seedDatabase();
          console.log('✅ Auto-seed completed successfully!');
        }
      } catch (seedErr) {
        console.warn('⚠️ Seeding check skipped:', seedErr.message);
      }

      return conn;
    } catch (error) {
      cachedPromise = null;
      console.warn(`⚠️ Could not connect to MongoDB URI (${uri}): ${error.message}`);
      return null;
    }
  })();

  return cachedPromise;
};

module.exports = connectDB;

