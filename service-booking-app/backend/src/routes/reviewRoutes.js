const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getServiceReviews,
  getProviderReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Create Review
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  [
    body('bookingId', 'Booking ID is required').notEmpty(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('title', 'Review title is required').trim().notEmpty(),
    body('comment', 'Review comment is required').trim().notEmpty()
  ],
  handleValidationErrors,
  createReview
);

// Get Service Reviews
router.get('/service/:serviceId', getServiceReviews);

// Get Provider Reviews
router.get('/provider/:providerId', getProviderReviews);

// Update Review
router.put(
  '/:reviewId',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  updateReview
);

// Delete Review
router.delete(
  '/:reviewId',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  deleteReview
);

module.exports = router;
