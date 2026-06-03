const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');
const { calculateRating } = require('../utils/helpers');

const buildCityProviderFilter = async (city) => {
  if (!city) return {};

  const providers = await User.find({
    role: 'provider',
    isActive: true,
    'address.city': { $regex: city, $options: 'i' }
  }).select('_id');

  return { providerId: { $in: providers.map((provider) => provider._id) } };
};

const getCategoryFromQuery = (query) => {
  const normalized = (query || '').toLowerCase();
  const aliases = [
    { category: 'electrician', terms: ['electrician'] },
    { category: 'plumber', terms: ['plumber'] },
    { category: 'carpenter', terms: ['carpenter'] },
    { category: 'painter', terms: ['painter'] },
    { category: 'electrical', terms: ['electrical'] },
    { category: 'plumbing', terms: ['plumbing'] },
    { category: 'carpentry', terms: ['carpentry'] },
    { category: 'painting', terms: ['painting'] },
    { category: 'home-cleaning', terms: ['home cleaning', 'house cleaning'] },
    { category: 'cleaning', terms: ['cleaning'] },
    { category: 'gardening-service', terms: ['gardening service'] },
    { category: 'landscaping', terms: ['gardening', 'garden', 'landscaping'] },
    { category: 'pest-control', terms: ['pest', 'pest control'] },
    { category: 'ac-repair-installation', terms: ['ac repair', 'ac installation'] },
    { category: 'hvac', terms: ['hvac'] },
    { category: 'ro-water-purifier-service', terms: ['water purifier', 'ro water'] },
    { category: 'cctv-installation', terms: ['cctv'] },
    { category: 'appliance-repair', terms: ['appliance', 'fridge', 'washing machine', 'tv repair'] },
    { category: 'locksmith', terms: ['locksmith', 'lock'] },
    { category: 'home-tutor', terms: ['home tutor'] },
    { category: 'online-tutor', terms: ['online tutor'] },
    { category: 'spoken-english-trainer', terms: ['spoken english'] },
    { category: 'computer-classes', terms: ['computer classes'] },
    { category: 'music-teacher', terms: ['music teacher'] },
    { category: 'dance-instructor', terms: ['dance instructor'] },
    { category: 'exam-coaching', terms: ['exam coaching'] },
    { category: 'photographer', terms: ['photographer'] },
    { category: 'videographer', terms: ['videographer'] },
    { category: 'dj', terms: ['dj'] },
    { category: 'decorator', terms: ['decorator'] },
    { category: 'caterer', terms: ['caterer'] },
    { category: 'makeup-artist', terms: ['makeup artist'] },
    { category: 'mehendi-artist', terms: ['mehendi artist'] },
    { category: 'event-planner', terms: ['event planner'] },
    { category: 'bike-mechanic', terms: ['bike mechanic'] },
    { category: 'car-mechanic', terms: ['car mechanic'] },
    { category: 'car-wash', terms: ['car wash'] },
    { category: 'towing-service', terms: ['towing service'] },
    { category: 'driving-instructor', terms: ['driving instructor'] },
    { category: 'vehicle-rental', terms: ['vehicle rental'] },
    { category: 'fitness-trainer', terms: ['fitness trainer'] },
    { category: 'yoga-instructor', terms: ['yoga instructor'] },
    { category: 'physiotherapist', terms: ['physiotherapist'] },
    { category: 'dietician', terms: ['dietician'] },
    { category: 'home-nurse', terms: ['home nurse'] },
    { category: 'elder-care-assistant', terms: ['elder care'] },
    { category: 'web-developer', terms: ['web developer'] },
    { category: 'graphic-designer', terms: ['graphic designer'] },
    { category: 'video-editor', terms: ['video editor'] },
    { category: 'social-media-manager', terms: ['social media manager'] },
    { category: 'content-writer', terms: ['content writer'] },
    { category: 'digital-marketing-expert', terms: ['digital marketing'] },
    { category: 'laundry-pickup', terms: ['laundry'] },
    { category: 'house-shifting-helper', terms: ['house shifting'] },
    { category: 'delivery-person', terms: ['delivery person'] },
    { category: 'pet-care', terms: ['pet care'] },
    { category: 'security-guard', terms: ['security guard'] },
    { category: 'tractor-rental', terms: ['tractor rental'] },
    { category: 'farm-labor-booking', terms: ['farm labor'] },
    { category: 'borewell-services', terms: ['borewell'] },
    { category: 'irrigation-setup', terms: ['irrigation'] },
    { category: 'agricultural-consultant', terms: ['agricultural consultant'] }
  ];

  return aliases.find((alias) => alias.terms.some((term) => normalized.includes(term)))?.category;
};

const normalizeHourlyRate = (value) => {
  const rate = Number(value);
  if (Number.isNaN(rate)) return value;
  return Math.min(250, Math.max(25, Math.round(rate)));
};

const createService = async (req, res) => {
  try {
    const { name, description, category, basePrice, estimatedDuration, highlights } = req.body;

    const service = new Service({
      providerId: req.user.id,
      name,
      description,
      category,
      basePrice: normalizeHourlyRate(basePrice),
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
      .populate('providerId', 'name businessName rating isOnline')
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
    const { page = 1, limit = 10, sortBy = 'rating', city } = req.query;

    const skip = (page - 1) * limit;
    const cityFilter = await buildCityProviderFilter(city);
    const filter = { category, isActive: true, ...cityFilter };

    const services = await Service.find(filter)
      .populate('providerId', 'name businessName rating address isOnline')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(filter);

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
    const { query, category, categories, maxPrice, city } = req.query;

    let filter = { isActive: true, ...(await buildCityProviderFilter(city)) };

    if (query) {
      const aliasCategory = getCategoryFromQuery(query);
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        ...(aliasCategory ? [{ category: aliasCategory }] : [])
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (categories) {
      const categoryList = categories.split(',').map((item) => item.trim()).filter(Boolean);
      if (categoryList.length > 0) {
        filter.category = { $in: categoryList };
      }
    }

    if (maxPrice) {
      filter.basePrice = { $lte: parseInt(maxPrice) };
    }

    const services = await Service.find(filter)
      .populate('providerId', 'name businessName rating address isOnline')
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
    if (updates.basePrice !== undefined) {
      service.basePrice = normalizeHourlyRate(updates.basePrice);
    }
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
