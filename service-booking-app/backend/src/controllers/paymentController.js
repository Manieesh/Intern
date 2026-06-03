const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { createOrder, verifyPayment } = require('../utils/razorpay');
const { PAYMENT_STATUS, BOOKING_STATUS } = require('../config/constants');

const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await createOrder(booking.totalAmount, bookingId);

    // Create payment record
    const payment = new Payment({
      bookingId,
      customerId: booking.customerId,
      providerId: booking.providerId,
      amount: booking.totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: PAYMENT_STATUS.PENDING
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment order created',
      orderId: razorpayOrder.id,
      amount: booking.totalAmount,
      currency: 'INR',
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
};

const verifyAndCompletePayment = async (req, res) => {
  try {
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify payment signature
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment record
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    payment.status = PAYMENT_STATUS.COMPLETED;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.bookingId);
    booking.paymentStatus = PAYMENT_STATUS.COMPLETED;
    booking.status = BOOKING_STATUS.CONFIRMED;
    booking.paymentDetails = {
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      method: 'razorpay'
    };
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('bookingId', 'bookingNumber totalAmount');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== PAYMENT_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    payment.status = PAYMENT_STATUS.REFUNDED;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
};

module.exports = {
  initializePayment,
  verifyAndCompletePayment,
  getPaymentDetails,
  refundPayment
};
