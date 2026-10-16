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

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
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

// Ensure database is connected for every incoming request (serverless compatible)
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS' || req.path === '/api/health' || req.path === '/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err.message);
    if (process.env.VERCEL && !process.env.MONGO_URI) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please configure MONGO_URI in your Vercel Environment Variables.',
        hint: 'Add your MongoDB Atlas connection string in Vercel Project Settings > Environment Variables.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to establish database connection.',
      error: err.message
    });
  }
});

// API Router definition (mounted on both '/api' and '/' for seamless Vercel rewrites)
const apiRouter = express.Router();

// Base health check
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

// Catch 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on this server.`
  });
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

