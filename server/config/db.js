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

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/municipal_waste_management';
  const isVercel = Boolean(process.env.VERCEL);

  cachedPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
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
      console.warn(`⚠️ Could not connect to primary MongoDB URI (${uri}): ${error.message}`);

      // If running on Vercel, in-memory mongodb is not supported
      if (isVercel) {
        console.error('❌ Vercel Serverless Environment: In-memory MongoDB fallback cannot run.');
        console.error('👉 Please configure MONGO_URI in your Vercel Project Settings > Environment Variables.');
        throw new Error('Database connection failed. Please configure MONGO_URI in Vercel environment variables.');
      }

      console.log('🔄 Attempting fallback to in-memory MongoDB for offline/local demonstration...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          instance: {
            dbName: 'municipal_waste_management'
          }
        });
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`✅ Connected to Embedded MongoMemoryServer at ${memoryUri}`);

        // Auto seed in-memory database if empty
        const { seedDatabase } = require('../seed/seedData');
        await seedDatabase();
        console.log('✅ Embedded database auto-seeded successfully with demo records!');
        cachedConnection = conn;
        return conn;
      } catch (memError) {
        console.error(`❌ Fatal: Could not establish MongoDB connection: ${memError.message}`);
        throw error;
      }
    }
  })();

  return cachedPromise;
};

module.exports = connectDB;

