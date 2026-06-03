const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllBookings,
  verifyServiceProvider,
  suspendUser,
  reactivateUser,
  getFlaggedReviews,
  getPaymentStats
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate, authorize(USER_ROLES.ADMIN));

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// Get All Users
router.get('/users', getAllUsers);

// Verify Service Provider
router.put('/users/:userId/verify', verifyServiceProvider);

// Suspend User
router.put('/users/:userId/suspend', suspendUser);

// Reactivate User
router.put('/users/:userId/reactivate', reactivateUser);

// Get All Bookings
router.get('/bookings', getAllBookings);

// Get Flagged Reviews
router.get('/reviews/flagged', getFlaggedReviews);

// Get Payment Stats
router.get('/payments/stats', getPaymentStats);

module.exports = router;
