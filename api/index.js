const path = require('path');
// Ensure dependencies from server/node_modules can be resolved as fallback
module.paths.push(path.join(__dirname, '../server/node_modules'));
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config();

// Import configured Express application
const app = require('../server/server');

// Normalize request URL if rewritten by Vercel
app.use((req, res, next) => {
  if (req.headers && req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  }
  next();
});

// Export Express app directly for Vercel Serverless Function runtime
module.exports = app;

