const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config();

let app;
let initError = null;

try {
  app = require('../server/server');
} catch (err) {
  console.error('Fatal initialization error in api/index.js:', err);
  initError = err;
}

// Export Express app wrapper for Vercel Serverless Function runtime
module.exports = (req, res) => {
  if (initError) {
    console.error('Returning initialization error:', initError);
    return res.status(500).json({
      error: 'Serverless initialization failed',
      message: initError.message,
      stack: initError.stack
    });
  }

  try {
    return app(req, res);
  } catch (runtimeError) {
    console.error('Runtime error in serverless handler:', runtimeError);
    return res.status(500).json({
      error: 'Runtime execution failed',
      message: runtimeError.message,
      stack: runtimeError.stack
    });
  }
};



