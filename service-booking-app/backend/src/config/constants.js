// User Roles
const USER_ROLES = {
  CUSTOMER: 'customer',
  SERVICE_PROVIDER: 'provider',
  ADMIN: 'admin'
};

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Service Categories
const SERVICE_CATEGORIES = [
  'plumbing',
  'electrical',
  'carpentry',
  'painting',
  'cleaning',
  'landscaping',
  'pest-control',
  'hvac',
  'appliance-repair',
  'locksmith'
];

module.exports = {
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  SERVICE_CATEGORIES
};
