const Service = require('../models/Service');
const Review = require('../models/Review');
const { calculateRating } = require('../utils/helpers');

const createService = async (req, res) => {
  try {
    const { name, description, category, basePrice, estimatedDuration, highlights } = req.body;

    const service = new Service({
      providerId: req.user.id,
      name,
      description,
      category,
      basePrice,
      estimatedDuration,
      highlights,
      isActive: true
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const { providerId } = req.params;

    const services = await Service.find({ providerId, isActive: true })
      .populate('providerId', 'name businessName rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sortBy = 'rating' } = req.query;

    const skip = (page - 1) * limit;

    const services = await Service.find({ category, isActive: true })
      .populate('providerId', 'name businessName rating rating')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments({ category, isActive: true });

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

const searchServices = async (req, res) => {
  try {
    const { query, category, maxPrice } = req.query;

    let filter = { isActive: true };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (maxPrice) {
      filter.basePrice = { $lte: parseInt(maxPrice) };
    }

    const services = await Service.find(filter)
      .populate('providerId', 'name businessName rating')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

const getServiceDetails = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId)
      .populate('providerId', '-password');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get service reviews
    const reviews = await Review.find({ serviceId })
      .populate('customerId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      service,
      reviews,
      reviewCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service details',
      error: error.message
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;

    let service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    Object.assign(service, updates);
    service.updatedAt = Date.now();
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

module.exports = {
  createService,
  getProviderServices,
  getServicesByCategory,
  searchServices,
  getServiceDetails,
  updateService,
  deleteService
};
