require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const connectDB = require('../config/database');
const { USER_ROLES } = require('../config/constants');

const providers = [
  {
    user: {
      name: 'Arun Electric Works',
      email: 'arun.electric@servicehub.com',
      password: 'password123',
      phone: '9876500001',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Arun Electric Works',
      category: 'electrical',
      experienceYears: 9,
      rating: 4.8,
      totalReviews: 42,
      isVerified: true,
      address: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Home Electrical Wiring',
        description: 'Certified wiring, switchboard setup, lighting installation, and electrical safety checks.',
        category: 'electrical',
        basePrice: 799,
        estimatedDuration: { value: 3, unit: 'hours' },
        rating: 4.8,
        totalReviews: 31
      }
    ]
  },
  {
    user: {
      name: 'Metro Plumbing Care',
      email: 'metro.plumbing@servicehub.com',
      password: 'password123',
      phone: '9876500002',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Metro Plumbing Care',
      category: 'plumbing',
      experienceYears: 7,
      rating: 4.7,
      totalReviews: 36,
      isVerified: true,
      address: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Pipe Leak Repair',
        description: 'Fast leak detection, pipe replacement, tap fitting, and bathroom plumbing repairs.',
        category: 'plumbing',
        basePrice: 499,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.7,
        totalReviews: 28
      }
    ]
  },
  {
    user: {
      name: 'FreshNest Cleaning',
      email: 'freshnest.cleaning@servicehub.com',
      password: 'password123',
      phone: '9876500003',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'FreshNest Cleaning',
      category: 'cleaning',
      experienceYears: 5,
      rating: 4.9,
      totalReviews: 54,
      isVerified: true,
      address: { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Premium House Cleaning',
        description: 'Deep home cleaning for kitchens, bathrooms, floors, windows, and furniture surfaces.',
        category: 'cleaning',
        basePrice: 1299,
        estimatedDuration: { value: 4, unit: 'hours' },
        rating: 4.9,
        totalReviews: 46
      }
    ]
  },
  {
    user: {
      name: 'CoolAir AC Experts',
      email: 'coolair.ac@servicehub.com',
      password: 'password123',
      phone: '9876500004',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'CoolAir AC Experts',
      category: 'hvac',
      experienceYears: 8,
      rating: 4.8,
      totalReviews: 39,
      isVerified: true,
      address: { city: 'Madurai', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'AC Service and Repair',
        description: 'AC cleaning, cooling issue repair, gas refill inspection, and installation support.',
        category: 'hvac',
        basePrice: 899,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.8,
        totalReviews: 34
      }
    ]
  },
  {
    user: {
      name: 'Kovai WoodCraft',
      email: 'kovai.woodcraft@servicehub.com',
      password: 'password123',
      phone: '9876500005',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Kovai WoodCraft',
      category: 'carpentry',
      experienceYears: 11,
      rating: 4.7,
      totalReviews: 44,
      isVerified: true,
      address: { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Custom Furniture Repair',
        description: 'Wardrobe repair, modular furniture fitting, door alignment, and custom woodwork.',
        category: 'carpentry',
        basePrice: 699,
        estimatedDuration: { value: 3, unit: 'hours' },
        rating: 4.7,
        totalReviews: 33
      }
    ]
  },
  {
    user: {
      name: 'Madurai Paint Studio',
      email: 'madurai.paint@servicehub.com',
      password: 'password123',
      phone: '9876500006',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Madurai Paint Studio',
      category: 'painting',
      experienceYears: 10,
      rating: 4.6,
      totalReviews: 29,
      isVerified: true,
      address: { city: 'Madurai', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Interior Wall Painting',
        description: 'Premium wall painting, texture finish, color consultation, and clean handover.',
        category: 'painting',
        basePrice: 2499,
        estimatedDuration: { value: 1, unit: 'days' },
        rating: 4.6,
        totalReviews: 24
      }
    ]
  },
  {
    user: {
      name: 'Trichy Appliance Care',
      email: 'trichy.appliance@servicehub.com',
      password: 'password123',
      phone: '9876500007',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Trichy Appliance Care',
      category: 'appliance-repair',
      experienceYears: 8,
      rating: 4.8,
      totalReviews: 41,
      isVerified: true,
      address: { city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Washing Machine Repair',
        description: 'Diagnosis and repair for washing machines, refrigerators, ovens, and common home appliances.',
        category: 'appliance-repair',
        basePrice: 599,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.8,
        totalReviews: 35
      }
    ]
  },
  {
    user: {
      name: 'Salem Secure Locks',
      email: 'salem.locks@servicehub.com',
      password: 'password123',
      phone: '9876500008',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Salem Secure Locks',
      category: 'locksmith',
      experienceYears: 6,
      rating: 4.7,
      totalReviews: 26,
      isVerified: true,
      address: { city: 'Salem', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Door Lock Installation',
        description: 'Smart lock setup, duplicate keys, lock repair, and emergency door unlocking.',
        category: 'locksmith',
        basePrice: 449,
        estimatedDuration: { value: 1, unit: 'hours' },
        rating: 4.7,
        totalReviews: 21
      }
    ]
  },
  {
    user: {
      name: 'Erode GreenScape',
      email: 'erode.greenscape@servicehub.com',
      password: 'password123',
      phone: '9876500009',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Erode GreenScape',
      category: 'landscaping',
      experienceYears: 9,
      rating: 4.5,
      totalReviews: 22,
      isVerified: true,
      address: { city: 'Erode', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Garden Maintenance',
        description: 'Lawn care, balcony gardening, plant trimming, garden cleanup, and soil treatment.',
        category: 'landscaping',
        basePrice: 999,
        estimatedDuration: { value: 3, unit: 'hours' },
        rating: 4.5,
        totalReviews: 18
      }
    ]
  },
  {
    user: {
      name: 'Thanjavur Pest Shield',
      email: 'thanjavur.pest@servicehub.com',
      password: 'password123',
      phone: '9876500010',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Thanjavur Pest Shield',
      category: 'pest-control',
      experienceYears: 7,
      rating: 4.6,
      totalReviews: 31,
      isVerified: true,
      address: { city: 'Thanjavur', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Home Pest Control',
        description: 'Cockroach, termite, mosquito, ant, and general pest treatment for homes and shops.',
        category: 'pest-control',
        basePrice: 1199,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.6,
        totalReviews: 27
      }
    ]
  },
  {
    user: {
      name: 'Nellai Power Fix',
      email: 'nellai.powerfix@servicehub.com',
      password: 'password123',
      phone: '9876500011',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Nellai Power Fix',
      category: 'electrical',
      experienceYears: 12,
      rating: 4.9,
      totalReviews: 48,
      isVerified: true,
      address: { city: 'Tirunelveli', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Inverter and Electrical Repair',
        description: 'Inverter wiring, power backup checks, MCB replacement, and electrical troubleshooting.',
        category: 'electrical',
        basePrice: 699,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.9,
        totalReviews: 39
      }
    ]
  },
  {
    user: {
      name: 'Nagercoil CleanPro',
      email: 'nagercoil.cleanpro@servicehub.com',
      password: 'password123',
      phone: '9876500012',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Nagercoil CleanPro',
      category: 'cleaning',
      experienceYears: 6,
      rating: 4.8,
      totalReviews: 37,
      isVerified: true,
      address: { city: 'Nagercoil', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Bathroom Deep Cleaning',
        description: 'Tile descaling, floor scrubbing, mirror cleaning, fixture polishing, and odor removal.',
        category: 'cleaning',
        basePrice: 799,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.8,
        totalReviews: 32
      }
    ]
  },
  {
    user: {
      name: 'Vellore Pipe Masters',
      email: 'vellore.pipe@servicehub.com',
      password: 'password123',
      phone: '9876500013',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Vellore Pipe Masters',
      category: 'plumbing',
      experienceYears: 10,
      rating: 4.7,
      totalReviews: 34,
      isVerified: true,
      address: { city: 'Vellore', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Bathroom Fitting Service',
        description: 'Tap fitting, shower installation, wash basin setup, drainage repair, and pipe checks.',
        category: 'plumbing',
        basePrice: 549,
        estimatedDuration: { value: 2, unit: 'hours' },
        rating: 4.7,
        totalReviews: 29
      }
    ]
  },
  {
    user: {
      name: 'Tiruppur Cool Tech',
      email: 'tiruppur.cooltech@servicehub.com',
      password: 'password123',
      phone: '9876500014',
      role: USER_ROLES.SERVICE_PROVIDER,
      businessName: 'Tiruppur Cool Tech',
      category: 'hvac',
      experienceYears: 7,
      rating: 4.6,
      totalReviews: 25,
      isVerified: true,
      address: { city: 'Tiruppur', state: 'Tamil Nadu', country: 'India' }
    },
    services: [
      {
        name: 'Split AC Installation',
        description: 'Split AC installation, bracket fitting, drainage pipe setup, and performance testing.',
        category: 'hvac',
        basePrice: 1499,
        estimatedDuration: { value: 3, unit: 'hours' },
        rating: 4.6,
        totalReviews: 20
      }
    ]
  }
];

const ensureDemoData = async () => {
  await connectDB();

  let createdServices = 0;
  let updatedProviders = 0;
  for (const providerData of providers) {
    const provider = await User.findOneAndUpdate(
      { email: providerData.user.email },
      providerData.user,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    updatedProviders += 1;

    for (const service of providerData.services) {
      const result = await Service.updateOne(
        { providerId: provider._id, name: service.name },
        {
          $set: {
            ...service,
            providerId: provider._id,
            highlights: ['Verified provider', 'Transparent pricing', 'Fast booking'],
            isActive: true
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        createdServices += 1;
      }
    }
  }

  console.log(`Demo data ready. Providers upserted: ${updatedProviders}. New services created: ${createdServices}.`);
  await mongoose.disconnect();
};

ensureDemoData().catch((error) => {
  console.error(error);
  process.exit(1);
});
