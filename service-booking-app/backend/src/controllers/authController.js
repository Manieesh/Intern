const User = require('../models/User');
const Service = require('../models/Service');
const axios = require('axios');
const { generateToken } = require('../utils/jwt');
const { USER_ROLES } = require('../config/constants');

const normalizeHourlyRate = (value) => {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate <= 0) return 100;
  return Math.min(250, Math.max(25, Math.round(rate)));
};

const formatCategoryName = (category) => {
  return category
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, category, city } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      role: role || USER_ROLES.CUSTOMER,
      ...(city && {
        address: {
          city,
          country: 'India'
        }
      }),
      ...(role === USER_ROLES.SERVICE_PROVIDER && {
        category,
        isVerified: false
      })
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    if ([USER_ROLES.CUSTOMER, USER_ROLES.SERVICE_PROVIDER].includes(role) && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This email is registered as a ${user.role === USER_ROLES.SERVICE_PROVIDER ? 'provider' : 'customer'} account`
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, city, role } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const allowedGoogleRoles = [USER_ROLES.CUSTOMER, USER_ROLES.SERVICE_PROVIDER];
    const requestedRole = allowedGoogleRoles.includes(role) ? role : USER_ROLES.CUSTOMER;

    if (!googleClientId || googleClientId === 'your_google_oauth_client_id') {
      return res.status(500).json({
        success: false,
        message: 'Google login is not configured'
      });
    }

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    const { data: googleUser } = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
      params: { id_token: credential }
    });

    if (googleUser.aud !== googleClientId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        phone: 'Not provided',
        role: requestedRole,
        profileImage: googleUser.picture,
        authProvider: 'google',
        googleId: googleUser.sub,
        isEmailVerified: googleUser.email_verified === true || googleUser.email_verified === 'true',
        ...(requestedRole === USER_ROLES.SERVICE_PROVIDER && {
          isVerified: false
        }),
        ...(city && {
          address: {
            city,
            country: 'India'
          }
        })
      });
    } else {
      if (user.role !== requestedRole) {
        return res.status(400).json({
          success: false,
          message: `This Google account is already registered as a ${user.role === USER_ROLES.SERVICE_PROVIDER ? 'provider' : 'customer'}`
        });
      }

      user.authProvider = user.authProvider || 'google';
      user.googleId = user.googleId || googleUser.sub;
      user.profileImage = user.profileImage || googleUser.picture;
      user.isEmailVerified = user.isEmailVerified || googleUser.email_verified === true || googleUser.email_verified === 'true';
      if (city) {
        user.address = {
          ...user.address,
          city,
          country: user.address?.country || 'India'
        };
      }
    }

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Google login failed',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, businessName, businessDescription, experienceYears, category, isOnline } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update common fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Update provider-specific fields
    if (user.role === USER_ROLES.SERVICE_PROVIDER) {
      if (businessName) user.businessName = businessName;
      if (businessDescription) user.businessDescription = businessDescription;
      if (experienceYears) user.experienceYears = experienceYears;
      if (category) user.category = category;
      if (typeof isOnline === 'boolean') user.isOnline = isOnline;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: error.message
    });
  }
};

const updateProviderAvailability = async (req, res) => {
  try {
    const { isOnline, city, category, hourlyRate } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== USER_ROLES.SERVICE_PROVIDER) {
      return res.status(403).json({
        success: false,
        message: 'Only provider accounts can go online'
      });
    }

    if (isOnline && (!city || !category)) {
      return res.status(400).json({
        success: false,
        message: 'Select your city and job before going online'
      });
    }

    if (typeof isOnline === 'boolean') {
      user.isOnline = isOnline;
    }

    if (category) {
      user.category = category;
    }

    if (city) {
      user.address = {
        ...(user.address?.toObject ? user.address.toObject() : user.address || {}),
        city,
        state: user.address?.state || 'Tamil Nadu',
        country: user.address?.country || 'India'
      };
    }

    let service = null;

    if (isOnline) {
      const serviceName = formatCategoryName(category);
      const basePrice = normalizeHourlyRate(hourlyRate);

      service = await Service.findOne({
        providerId: user._id,
        category,
        isActive: true
      });

      if (service) {
        service.name = service.name || serviceName;
        service.description = service.description || `${serviceName} available in ${city}. Book this verified provider by the hour.`;
        service.basePrice = basePrice;
        service.estimatedDuration = service.estimatedDuration || { value: 1, unit: 'hours' };
        service.updatedAt = Date.now();
      } else {
        service = new Service({
          providerId: user._id,
          name: serviceName,
          description: `${serviceName} available in ${city}. Book this verified provider by the hour.`,
          category,
          basePrice,
          estimatedDuration: {
            value: 1,
            unit: 'hours'
          },
          isActive: true
        });
      }

      await service.save();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isOnline ? 'Provider is online' : 'Provider is offline',
      user: user.toJSON(),
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update provider availability',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  updateProfile,
  updateProviderAvailability,
  getProfile
};
