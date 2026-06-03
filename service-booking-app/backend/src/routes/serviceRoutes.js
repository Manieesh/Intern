const express = require('express');
const { body } = require('express-validator');
const {
  createService,
  getProviderServices,
  getServicesByCategory,
  searchServices,
  getServiceDetails,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Create Service
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER),
  [
    body('name', 'Service name is required').trim().notEmpty(),
    body('description', 'Service description is required').trim().notEmpty(),
    body('category', 'Service category is required').notEmpty(),
    body('basePrice', 'Base price is required').isNumeric()
  ],
  handleValidationErrors,
  createService
);

// Get Provider Services
router.get('/provider/:providerId', getProviderServices);

// Get Services by Category
router.get('/category/:category', getServicesByCategory);

// Search Services
router.get('/search', searchServices);

// Get Service Details
router.get('/:serviceId', getServiceDetails);

// Update Service
router.put(
  '/:serviceId',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER),
  updateService
);

// Delete Service
router.delete(
  '/:serviceId',
  authenticate,
  authorize(USER_ROLES.SERVICE_PROVIDER),
  deleteService
);

module.exports = router;
