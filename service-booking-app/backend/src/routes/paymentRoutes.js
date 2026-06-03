const express = require('express');
const { body } = require('express-validator');
const {
  initializePayment,
  verifyAndCompletePayment,
  getPaymentDetails,
  refundPayment
} = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Initialize Payment
router.post(
  '/initialize',
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  [
    body('bookingId', 'Booking ID is required').notEmpty()
  ],
  handleValidationErrors,
  initializePayment
);

// Verify and Complete Payment
router.post(
  '/verify',
  authenticate,
  [
    body('paymentId', 'Payment ID is required').notEmpty(),
    body('razorpayOrderId', 'Razorpay Order ID is required').notEmpty(),
    body('razorpayPaymentId', 'Razorpay Payment ID is required').notEmpty(),
    body('razorpaySignature', 'Razorpay Signature is required').notEmpty()
  ],
  handleValidationErrors,
  verifyAndCompletePayment
);

// Get Payment Details
router.get('/:paymentId', authenticate, getPaymentDetails);

// Refund Payment
router.post(
  '/:paymentId/refund',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  refundPayment
);

module.exports = router;
