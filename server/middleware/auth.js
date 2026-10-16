const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_municipal_waste_mgmt_key_2026_secure');

      // Demo token bypass for offline/cloud demo mode
      if (decoded.id === '67b000000000000000000001') {
        req.user = {
          _id: '67b000000000000000000001',
          id: '67b000000000000000000001',
          name: 'Municipal Administrator (Demo)',
          email: 'admin@municipal.com',
          role: 'ADMIN',
          department: 'Administration',
          isActive: true
        };
        return next();
      }
      if (decoded.id === '67b000000000000000000002') {
        req.user = {
          _id: '67b000000000000000000002',
          id: '67b000000000000000000002',
          name: 'Field Officer (Demo)',
          email: 'staff@municipal.com',
          role: 'STAFF',
          department: 'Operations & Collections',
          isActive: true
        };
        return next();
      }
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Authorization denied.'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'User account has been deactivated. Please contact an Administrator.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token was provided.'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
