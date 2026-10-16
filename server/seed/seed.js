const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const { seedDatabase } = require('./seedData');

const runSeed = async () => {
  try {
    console.log(' Starting database seeding process...');
    await connectDB();
    await seedDatabase();
    console.log(' Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
