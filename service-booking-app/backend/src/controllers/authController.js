const User = require('../models/User');
const axios = require('axios');
const { generateToken } = require('../utils/jwt');
const { USER_ROLES } = require('../config/constants');

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
    const { email, password } = req.body;

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
    const { credential, city } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

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
        role: USER_ROLES.CUSTOMER,
        profileImage: googleUser.picture,
        authProvider: 'google',
        googleId: googleUser.sub,
        isEmailVerified: googleUser.email_verified === 'true',
        ...(city && {
          address: {
            city,
            country: 'India'
          }
        })
      });
    } else {
      user.authProvider = user.authProvider || 'google';
      user.googleId = user.googleId || googleUser.sub;
      user.profileImage = user.profileImage || googleUser.picture;
      user.isEmailVerified = user.isEmailVerified || googleUser.email_verified === 'true';
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
    const { name, phone, address, businessName, businessDescription, experienceYears } = req.body;

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
  getProfile
};
