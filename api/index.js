const path = require('path');
const dotenv = require('dotenv');

// Load environment variables if available
try {
  dotenv.config({ path: path.join(__dirname, '../server/.env') });
  dotenv.config();
} catch (e) {}

let app = null;
let loadError = null;

try {
  app = require('../server/server');
} catch (err) {
  console.error('Failed to load ../server/server:', err);
  loadError = {
    message: err.message,
    stack: err.stack,
    code: err.code
  };
}

if (loadError) {
  const express = require('express');
  const fallbackApp = express();
  fallbackApp.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      error: 'Backend Module Load Failure',
      details: loadError
    });
  });
  module.exports = fallbackApp;
} else {
  module.exports = app;
}
