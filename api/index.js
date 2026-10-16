const path = require('path');
// Ensure dependencies from server/node_modules can be resolved as fallback
module.paths.push(path.join(__dirname, '../server/node_modules'));
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config();

// Import configured Express application
const app = require('../server/server');

// Export Express app directly for Vercel Serverless Function runtime
module.exports = app;


