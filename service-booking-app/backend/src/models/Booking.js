const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceDetails: {
      name: String,
      basePrice: Number,
      estimatedDuration: Object
    },
    bookingAddress: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      start: String,
      end: String
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    paymentDetails: {
      paymentId: String,
      orderId: String,
      method: String
    },
    serviceOtp: {
      type: String,
      required: true
    },
    serviceOtpVerifiedAt: Date,
    notes: String,
    cancellationReason: String,
    cancellationCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    providerCancellationEarning: {
      type: Number,
      default: 0,
      min: 0
    },
    cancelledAt: Date,
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'bookings' }
);

// Generate booking number before validation so the required field is present.
bookingSchema.pre('validate', async function (next) {
  if (!this.isNew || this.bookingNumber) return next();

  const count = await mongoose.model('Booking').countDocuments();
  this.bookingNumber = `BK-${Date.now()}-${count + 1}`;
  next();
});

// Indexes for faster queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, scheduledDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
