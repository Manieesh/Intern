const mongoose = require('mongoose');
const { SERVICE_CATEGORIES } = require('../config/constants');

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      enum: SERVICE_CATEGORIES,
      required: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: [25, 'Hourly rate must be at least Rs 25'],
      max: [250, 'Hourly rate cannot exceed Rs 250']
    },
    estimatedDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days'],
        default: 'hours'
      }
    },
    images: [String],
    highlights: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'services' }
);

// Index for faster queries
serviceSchema.index({ providerId: 1, category: 1 });
serviceSchema.index({ category: 1, rating: -1 });

module.exports = mongoose.model('Service', serviceSchema);
