const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin, updateProfile, updateProviderAvailability, getProfile } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('phone', 'Valid phone is required').isMobilePhone()
  ],
  handleValidationErrors,
  register
);

// Login
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').notEmpty()
  ],
  handleValidationErrors,
  login
);

// Google Login
router.post(
  '/google',
  [
    body('credential', 'Google credential is required').notEmpty()
  ],
  handleValidationErrors,
  googleLogin
);

// Get Profile
router.get('/profile', authenticate, getProfile);

// Update Profile
router.put('/profile', authenticate, updateProfile);

// Update provider availability and online service
router.put('/provider-availability', authenticate, authorize(USER_ROLES.SERVICE_PROVIDER), updateProviderAvailability);

module.exports = router;
