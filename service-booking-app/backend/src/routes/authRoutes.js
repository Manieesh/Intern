const express = require('express');
const { body } = require('express-validator');
const { register, login, updateProfile, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');

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

// Get Profile
router.get('/profile', authenticate, getProfile);

// Update Profile
router.put('/profile', authenticate, updateProfile);

module.exports = router;
