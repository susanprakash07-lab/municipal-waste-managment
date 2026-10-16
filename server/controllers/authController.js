const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_municipal_waste_mgmt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an email and a password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Fallback for cloud demo mode when external MongoDB is not yet configured
    if (req.isDemoMode || !mongoose.connection || mongoose.connection.readyState !== 1) {
      if (cleanEmail === 'admin@municipal.com' && password === 'Admin@123') {
        const demoUser = {
          _id: '67b000000000000000000001',
          name: 'Municipal Administrator (Demo)',
          email: 'admin@municipal.com',
          role: 'ADMIN',
          department: 'Administration',
          phone: '+91 98765 43210',
          createdAt: new Date().toISOString()
        };
        const token = generateToken(demoUser._id);
        return res.status(200).json({
          success: true,
          token,
          user: demoUser,
          message: 'Welcome back, Administrator!'
        });
      }
      if (cleanEmail === 'staff@municipal.com' && password === 'Staff@123') {
        const demoUser = {
          _id: '67b000000000000000000002',
          name: 'Field Officer (Demo)',
          email: 'staff@municipal.com',
          role: 'STAFF',
          department: 'Operations & Collections',
          phone: '+91 98765 43211',
          createdAt: new Date().toISOString()
        };
        const token = generateToken(demoUser._id);
        return res.status(200).json({
          success: true,
          token,
          user: demoUser,
          message: 'Welcome back, Field Officer!'
        });
      }
    }

    // Check for user in MongoDB
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an Administrator.'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    const token = generateToken(user._id);

    // Sanitize user object
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
      message: `Welcome back, ${user.name}!`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department) user.department = department;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  updateProfile,
  changePassword
};
