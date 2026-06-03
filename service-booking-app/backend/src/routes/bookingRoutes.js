const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingDetails,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Create Booking
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  [
    body('serviceId', 'Service ID is required').notEmpty(),
    body('providerId', 'Provider ID is required').notEmpty(),
    body('scheduledDate', 'Scheduled date is required').notEmpty(),
    body('bookingAddress', 'Booking address is required').notEmpty()
  ],
  handleValidationErrors,
  createBooking
);

// Get My Bookings (Customer)
router.get('/my-bookings', authenticate, getMyBookings);

// Get Provider Bookings
router.get('/provider-bookings', authenticate, authorize(USER_ROLES.SERVICE_PROVIDER), getProviderBookings);

// Get Booking Details
router.get('/:bookingId', authenticate, getBookingDetails);

// Update Booking Status (Provider)
router.put(
  '/:bookingId/status',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER),
  [
    body('status', 'Status is required').notEmpty()
      .custom((status, { req }) => {
        if (status === 'in-progress' && !req.body.serviceOtp) {
          throw new Error('Customer OTP is required to start service');
        }
        return true;
      })
  ],
  handleValidationErrors,
  updateBookingStatus
);

// Cancel Booking
router.put('/:bookingId/cancel', authenticate, cancelBooking);

module.exports = router;
