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
  'electrician',
  'plumber',
  'carpenter',
  'painter',
  'ac-repair-installation',
  'ro-water-purifier-service',
  'cctv-installation',
  'appliance-repair',
  'home-cleaning',
  'pest-control',
  'home-tutor',
  'online-tutor',
  'spoken-english-trainer',
  'computer-classes',
  'music-teacher',
  'dance-instructor',
  'exam-coaching',
  'photographer',
  'videographer',
  'dj',
  'decorator',
  'caterer',
  'makeup-artist',
  'mehendi-artist',
  'event-planner',
  'bike-mechanic',
  'car-mechanic',
  'car-wash',
  'towing-service',
  'driving-instructor',
  'vehicle-rental',
  'fitness-trainer',
  'yoga-instructor',
  'physiotherapist',
  'dietician',
  'home-nurse',
  'elder-care-assistant',
  'web-developer',
  'graphic-designer',
  'video-editor',
  'social-media-manager',
  'content-writer',
  'digital-marketing-expert',
  'laundry-pickup',
  'house-shifting-helper',
  'delivery-person',
  'gardening-service',
  'pet-care',
  'security-guard',
  'tractor-rental',
  'farm-labor-booking',
  'borewell-services',
  'irrigation-setup',
  'agricultural-consultant',
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
