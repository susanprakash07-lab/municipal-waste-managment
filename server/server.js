const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const segregationRoutes = require('./routes/segregationRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const processingRoutes = require('./routes/processingRoutes');
const recyclingRoutes = require('./routes/recyclingRoutes');
const landfillRoutes = require('./routes/landfillRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
app.disable('x-powered-by');

// Normalize request URL if rewritten by Vercel
app.use((req, res, next) => {
  if (req.url && req.url.includes('index.js')) {
    if (req.originalUrl && !req.originalUrl.includes('index.js')) {
      req.url = req.originalUrl;
    } else {
      req.url = req.url.replace(/\/api\/index\.js/g, '/api').replace(/\/index\.js/g, '') || '/';
    }
  }
  next();
});

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  hidePoweredBy: false
}));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve pre-built React frontend static files
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Ensure database is connected for API requests
app.use(async (req, res, next) => {
  // Fast path: skip database check for options, health checks, or static assets
  if (
    req.method === 'OPTIONS' ||
    req.path.includes('health') ||
    !req.path.startsWith('/api')
  ) {
    return next();
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      req.isDemoMode = true;
    }
    next();
  } catch (err) {
    console.warn('Database connection warning (falling back to demo mode):', err.message);
    req.isDemoMode = true;
    next();
  }
});

// API Router definition (mounted on both '/api' and '/' for seamless Vercel rewrites)
const apiRouter = express.Router();

// Base health check (responds instantly with 0ms DB dependency)
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Digital Tracking System for Municipal Waste Management',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount operational routes on router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/segregation', segregationRoutes);
apiRouter.use('/collections', collectionRoutes);
apiRouter.use('/processing', processingRoutes);
apiRouter.use('/recycling-plants', recyclingRoutes);
apiRouter.use('/landfills', landfillRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/reports', reportsRoutes);
apiRouter.use('/search', searchRoutes);

// Mount router under both '/api' and root
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Frontend SPA Catch-all: serve index.html for all non-API paths
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found on this server.`
    });
  }
  const indexPath = path.join(clientDist, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Municipal Waste Management System</title>
      <style>body{font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0fdf4;color:#166534;text-align:center;padding:20px;}a{color:#0284c7;text-decoration:none;font-weight:600;}</style>
    </head>
    <body>
      <h1>🌿 Digital Tracking System for Municipal Waste Management</h1>
      <p>Server is running in online cloud mode.</p>
      <p><a href="/api/health">Check API Health &rarr;</a></p>
    </body>
    </html>
  `);
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start listening
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` MUNICIPAL WASTE MANAGEMENT SERVER STARTED`);
      console.log(` Mode:        ${process.env.NODE_ENV || 'development'}`);
      console.log(` Port:        ${PORT}`);
      console.log(` API Health:  http://localhost:${PORT}/api/health`);
      console.log(` Client URL:  http://localhost:5173`);
      console.log(`=======================================================`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
    });
    
    return server;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Only start HTTP listener when run directly (local node execution).
// On Vercel, the app is exported as a serverless function handler.
if (require.main === module) {
  startServer();
}

module.exports = app;

