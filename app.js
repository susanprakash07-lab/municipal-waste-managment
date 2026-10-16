/**
 * ==============================================================================
 * SINGLE-FILE MERN STACK RUNNER: Municipal Waste Management Tracking System
 * ==============================================================================
 * This single file runs the complete MERN application (MongoDB + Express + React + Node.js)
 * Usage in VS Code:
 *    node app.js
 * Browser URL:
 *    http://localhost:5000
 * ==============================================================================
 */

const path = require('path');
// Ensure dependencies from server/node_modules are resolved automatically
module.paths.push(path.join(__dirname, 'server/node_modules'));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables if available
dotenv.config({ path: path.join(__dirname, 'server/.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_municipal_waste_mgmt_key_2026_secure';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/municipal_waste_management';

// Security & Body Parsers
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. MONGOOSE MODELS (MongoDB Layer)
// ==========================================
const User = require('./server/models/User');
const WasteSegregation = require('./server/models/WasteSegregation');
const WasteCollection = require('./server/models/WasteCollection');
const WasteProcessing = require('./server/models/WasteProcessing');
const RecyclingPlant = require('./server/models/RecyclingPlant');
const Landfill = require('./server/models/Landfill');

// ==========================================
// 2. AUTHENTICATION & RBAC MIDDLEWARE
// ==========================================
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
  return res.status(401).json({ success: false, message: 'No authorization token provided' });
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: `Role '${req.user?.role}' forbidden` });
  }
  next();
};

// ==========================================
// 3. EXPRESS REST API ROUTES (Express Layer)
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', system: 'Municipal Waste Management System', time: new Date() });
});

// Auth Routes
const authController = require('./server/controllers/authController');
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', protect, authController.getMe);
app.put('/api/auth/update-profile', protect, authController.updateProfile);
app.put('/api/auth/change-password', protect, authController.changePassword);

// Dashboard Route
const dashboardController = require('./server/controllers/dashboardController');
app.get('/api/dashboard', protect, dashboardController.getDashboardStats);

// Waste Segregation Routes
const segController = require('./server/controllers/segregationController');
app.get('/api/segregation', protect, segController.getSegregations);
app.post('/api/segregation', protect, segController.createSegregation);
app.get('/api/segregation/:id', protect, segController.getSegregationById);
app.put('/api/segregation/:id', protect, segController.updateSegregation);
app.delete('/api/segregation/:id', protect, authorize('ADMIN'), segController.deleteSegregation);

// Waste Collection Routes
const colController = require('./server/controllers/collectionController');
app.get('/api/collections', protect, colController.getCollections);
app.post('/api/collections', protect, colController.createCollection);
app.get('/api/collections/:id', protect, colController.getCollectionById);
app.put('/api/collections/:id', protect, colController.updateCollection);
app.delete('/api/collections/:id', protect, authorize('ADMIN'), colController.deleteCollection);

// Waste Processing Routes
const prcController = require('./server/controllers/processingController');
app.get('/api/processing', protect, prcController.getProcessings);
app.post('/api/processing', protect, prcController.createProcessing);
app.get('/api/processing/:id', protect, prcController.getProcessingById);
app.put('/api/processing/:id', protect, prcController.updateProcessing);
app.delete('/api/processing/:id', protect, authorize('ADMIN'), prcController.deleteProcessing);

// Recycling Plant Routes
const rplController = require('./server/controllers/recyclingController');
app.get('/api/recycling-plants', protect, rplController.getPlants);
app.post('/api/recycling-plants', protect, rplController.createPlant);
app.get('/api/recycling-plants/:id', protect, rplController.getPlantById);
app.put('/api/recycling-plants/:id', protect, rplController.updatePlant);
app.delete('/api/recycling-plants/:id', protect, authorize('ADMIN'), rplController.deletePlant);

// Landfill Routes
const lnfController = require('./server/controllers/landfillController');
app.get('/api/landfills', protect, lnfController.getLandfills);
app.post('/api/landfills', protect, lnfController.createLandfill);
app.get('/api/landfills/:id', protect, lnfController.getLandfillById);
app.put('/api/landfills/:id', protect, lnfController.updateLandfill);
app.delete('/api/landfills/:id', protect, authorize('ADMIN'), lnfController.deleteLandfill);

// Reports & Search
const reportsController = require('./server/controllers/reportsController');
app.get('/api/reports', protect, reportsController.getReports);

const searchController = require('./server/controllers/searchController');
app.get('/api/search', protect, searchController.globalSearch);

// User Management (Admin Only)
const userController = require('./server/controllers/userController');
app.get('/api/users', protect, authorize('ADMIN'), userController.getUsers);
app.post('/api/users', protect, authorize('ADMIN'), userController.createUser);
app.get('/api/users/:id', protect, authorize('ADMIN'), userController.getUserById);
app.put('/api/users/:id', protect, authorize('ADMIN'), userController.updateUser);
app.delete('/api/users/:id', protect, authorize('ADMIN'), userController.deleteUser);

// ==========================================
// 4. REACT FRONTEND HOSTING (React Layer)
// ==========================================
// Serve pre-built production React frontend
const clientDistPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ==========================================
// 5. DATABASE CONNECTION & SERVER BOOTSTRAP (Node.js Layer)
// ==========================================
const connectDB = require('./server/config/db');
const { seedDatabase } = require('./server/seed/seedData');

const start = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Check if database needs initial seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Seeding initial municipal demo data...');
      await seedDatabase();
      console.log('✅ Seeding complete!');
    }

    app.listen(PORT, () => {
      console.log('\n====================================================================');
      console.log(' 🌿 DIGITAL TRACKING SYSTEM FOR MUNICIPAL WASTE MANAGEMENT');
      console.log('====================================================================');
      console.log(` 🚀 FULL APPLICATION RUNNING AT: http://localhost:${PORT}`);
      console.log(' 🔑 DEMO LOGIN CREDENTIALS:');
      console.log('    • Admin: admin@municipal.com / Admin@123');
      console.log('    • Staff: staff@municipal.com / Staff@123');
      console.log('====================================================================\n');
    });
  } catch (err) {
    console.error('❌ Failed to start application:', err.message);
  }
};

start();
