const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const Review = require('../models/Review');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

const parseTimeToMinutes = (time) => {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(time || '');
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const calculateBookedHours = (timeSlot) => {
  const start = parseTimeToMinutes(timeSlot?.start);
  const end = parseTimeToMinutes(timeSlot?.end);

  if (start === null || end === null || end <= start) {
    return null;
  }

  return (end - start) / 60;
};

const parseScheduleDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const validateFutureSchedule = (scheduledDate, timeSlot) => {
  const bookingDate = parseScheduleDate(scheduledDate);
  if (!bookingDate) return 'Please select a valid booking date';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

  if (selectedDay < today) {
    return 'Cannot book a service for a past date';
  }

  if (selectedDay.getTime() === today.getTime()) {
    const start = parseTimeToMinutes(timeSlot?.start);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    if (start !== null && start <= currentMinutes) {
      return 'Cannot book a service for a past time';
    }
  }

  return null;
};

const getCurrentUserId = (req) => req.user.id.toString();
const CANCELLATION_CHARGE_PERCENT = 20;
const generateServiceOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createBooking = async (req, res) => {
  try {
    const { serviceId, providerId, scheduledDate, timeSlot, bookingAddress, notes, paymentMethod } = req.body;

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    const bookedHours = calculateBookedHours(timeSlot);
    if (!bookedHours) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid start and end time'
      });
    }

    const scheduleError = validateFutureSchedule(scheduledDate, timeSlot);
    if (scheduleError) {
      return res.status(400).json({
        success: false,
        message: scheduleError
      });
    }

    const totalAmount = Math.round(service.basePrice * bookedHours);

    const booking = new Booking({
      customerId: req.user.id,
      serviceId,
      providerId,
      serviceDetails: {
        name: service.name,
        basePrice: service.basePrice,
        estimatedDuration: service.estimatedDuration
      },
      bookingAddress,
      scheduledDate: parseScheduleDate(scheduledDate),
      timeSlot,
      totalAmount,
      notes,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentDetails: {
        method: paymentMethod || 'postpaid'
      },
      serviceOtp: generateServiceOtp()
    });

    await booking.save();
    await booking.populate('providerId', 'name phone email address');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { customerId: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('serviceId', 'name category basePrice')
      .populate('providerId', 'name phone email address')
      .sort({ createdAt: -1 });

    const bookingIds = bookings.map((booking) => booking._id);
    const reviewedBookings = await Review.find({ bookingId: { $in: bookingIds } }).select('bookingId');
    const reviewedBookingIds = new Set(reviewedBookings.map((review) => review.bookingId.toString()));
    const bookingsWithReviewStatus = bookings.map((booking) => {
      const bookingObject = booking.toObject();
      bookingObject.hasReview = reviewedBookingIds.has(booking._id.toString());
      return bookingObject;
    });

    res.status(200).json({
      success: true,
      count: bookingsWithReviewStatus.length,
      bookings: bookingsWithReviewStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { providerId: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name phone email')
      .populate('serviceId', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name phone email address')
      .populate('providerId', 'name phone email businessName')
      .populate('serviceId', 'name description category basePrice');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const currentUserId = getCurrentUserId(req);
    if (booking.customerId._id.toString() !== currentUserId &&
      booking.providerId._id.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, serviceOtp } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only provider can update status
    if (booking.providerId.toString() !== getCurrentUserId(req)) {
      return res.status(403).json({
        success: false,
        message: 'Only provider can update booking status'
      });
    }

    if (status === BOOKING_STATUS.IN_PROGRESS) {
      if (booking.status !== BOOKING_STATUS.CONFIRMED) {
        return res.status(400).json({
          success: false,
          message: 'Order must be approved before starting service'
        });
      }

      if (!serviceOtp || serviceOtp.toString().trim() !== booking.serviceOtp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customer OTP'
        });
      }

      booking.serviceOtpVerifiedAt = new Date();
    }

    booking.status = status;

    if (status === BOOKING_STATUS.COMPLETED) {
      booking.completedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const currentUserId = getCurrentUserId(req);
    if (booking.customerId.toString() !== currentUserId &&
      booking.providerId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if ([BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancellationReason = reason;
    booking.cancellationCharge = Math.round((booking.totalAmount * CANCELLATION_CHARGE_PERCENT) / 100);
    booking.providerCancellationEarning = booking.cancellationCharge;
    booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingDetails,
  updateBookingStatus,
  cancelBooking
};
