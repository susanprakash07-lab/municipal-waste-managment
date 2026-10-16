const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config();

// Export the Express app directly for Vercel Serverless Function runtime
const app = require('../server/server');

module.exports = app;
