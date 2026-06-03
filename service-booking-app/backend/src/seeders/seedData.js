require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const connectDB = require('../config/database');
const { USER_ROLES } = require('../config/constants');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@servicehub.com',
      password: 'admin123',
      phone: '9999999999',
      role: USER_ROLES.ADMIN,
      isActive: true,
      isEmailVerified: true
    });
    await admin.save();

    // Create sample customers
    const customers = await User.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        password: 'password123',
        phone: '9876543210',
        role: USER_ROLES.CUSTOMER,
        isActive: true,
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        }
      },
      {
        name: 'Priya Singh',
        email: 'priya@email.com',
        password: 'password123',
        phone: '9876543211',
        role: USER_ROLES.CUSTOMER,
        isActive: true,
        address: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        }
      }
    ]);

    // Create sample service providers
    const providers = await User.insertMany([
      {
        name: 'Plumber John',
        email: 'john.plumber@email.com',
        password: 'password123',
        phone: '9876543201',
        role: USER_ROLES.SERVICE_PROVIDER,
        isActive: true,
        businessName: 'John\'s Plumbing Services',
        businessDescription: 'Expert plumbing services with 10 years experience',
        category: 'plumbing',
        experienceYears: 10,
        hourlyRate: 500,
        rating: 4.5,
        totalReviews: 25,
        isVerified: true,
        languages: ['English', 'Hindi'],
        address: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India'
        }
      },
      {
        name: 'Electrician Amit',
        email: 'amit.electrician@email.com',
        password: 'password123',
        phone: '9876543202',
        role: USER_ROLES.SERVICE_PROVIDER,
        isActive: true,
        businessName: 'Amit\'s Electrical Solutions',
        businessDescription: 'Professional electrical installations and repairs',
        category: 'electrical',
        experienceYears: 8,
        hourlyRate: 450,
        rating: 4.7,
        totalReviews: 30,
        isVerified: true,
        languages: ['English', 'Hindi'],
        address: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India'
        }
      },
      {
        name: 'Carpenter Raj',
        email: 'raj.carpenter@email.com',
        password: 'password123',
        phone: '9876543203',
        role: USER_ROLES.SERVICE_PROVIDER,
        isActive: true,
        businessName: 'Raj\'s Carpentry Works',
        businessDescription: 'Custom furniture and woodwork solutions',
        category: 'carpentry',
        experienceYears: 12,
        hourlyRate: 600,
        rating: 4.8,
        totalReviews: 35,
        isVerified: true,
        languages: ['English', 'Hindi', 'Marathi'],
        address: {
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India'
        }
      }
    ]);

    console.log('Created users...');

    // Create sample services
    const services = await Service.insertMany([
      {
        providerId: providers[0]._id,
        name: 'Pipe Repair & Installation',
        description: 'Expert pipe repair, installation, and maintenance services',
        category: 'plumbing',
        basePrice: 500,
        estimatedDuration: { value: 2, unit: 'hours' },
        highlights: ['Quick response', 'Professional service', 'Affordable rates'],
        rating: 4.5,
        totalReviews: 20,
        isActive: true
      },
      {
        providerId: providers[0]._id,
        name: 'Bathroom Plumbing',
        description: 'Complete bathroom plumbing solutions',
        category: 'plumbing',
        basePrice: 1500,
        estimatedDuration: { value: 4, unit: 'hours' },
        highlights: ['Modern fixtures', 'Quality work', 'Warranty included'],
        rating: 4.6,
        totalReviews: 15,
        isActive: true
      },
      {
        providerId: providers[1]._id,
        name: 'Home Electrical Wiring',
        description: 'Safe and efficient electrical wiring installation',
        category: 'electrical',
        basePrice: 800,
        estimatedDuration: { value: 3, unit: 'hours' },
        highlights: ['Safety certified', 'Latest standards', 'Fast execution'],
        rating: 4.7,
        totalReviews: 25,
        isActive: true
      },
      {
        providerId: providers[1]._id,
        name: 'Lighting Installation',
        description: 'Professional lighting installation and fixture setup',
        category: 'electrical',
        basePrice: 600,
        estimatedDuration: { value: 2, unit: 'hours' },
        highlights: ['Modern designs', 'Energy efficient', 'Expert installation'],
        rating: 4.8,
        totalReviews: 30,
        isActive: true
      },
      {
        providerId: providers[2]._id,
        name: 'Custom Furniture Making',
        description: 'Custom-made furniture according to your specifications',
        category: 'carpentry',
        basePrice: 2500,
        estimatedDuration: { value: 8, unit: 'hours' },
        highlights: ['Custom designs', 'Quality materials', 'Professional finish'],
        rating: 4.8,
        totalReviews: 28,
        isActive: true
      },
      {
        providerId: providers[2]._id,
        name: 'Door & Window Repair',
        description: 'Expert repair and maintenance of doors and windows',
        category: 'carpentry',
        basePrice: 800,
        estimatedDuration: { value: 3, unit: 'hours' },
        highlights: ['Durable repairs', 'Quick service', 'Competitive pricing'],
        rating: 4.7,
        totalReviews: 22,
        isActive: true
      }
    ]);

    console.log('Created services...');

    // Create sample bookings
    const bookings = await Booking.insertMany([
      {
        customerId: customers[0]._id,
        serviceId: services[0]._id,
        providerId: providers[0]._id,
        serviceDetails: {
          name: services[0].name,
          basePrice: services[0].basePrice,
          estimatedDuration: services[0].estimatedDuration
        },
        bookingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        timeSlot: { start: '10:00', end: '12:00' },
        totalAmount: 500,
        status: 'confirmed',
        paymentStatus: 'completed'
      },
      {
        customerId: customers[1]._id,
        serviceId: services[2]._id,
        providerId: providers[1]._id,
        serviceDetails: {
          name: services[2].name,
          basePrice: services[2].basePrice,
          estimatedDuration: services[2].estimatedDuration
        },
        bookingAddress: {
          street: '456 Park Ave',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001'
        },
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        timeSlot: { start: '14:00', end: '17:00' },
        totalAmount: 800,
        status: 'pending',
        paymentStatus: 'pending'
      }
    ]);

    console.log('Created bookings...');

    // Create sample reviews
    await Review.insertMany([
      {
        bookingId: bookings[0]._id,
        serviceId: services[0]._id,
        providerId: providers[0]._id,
        customerId: customers[0]._id,
        rating: 5,
        title: 'Excellent Service!',
        comment: 'John provided excellent plumbing service. Very professional and quick.',
        isVerifiedPurchase: true
      }
    ]);

    console.log('Created reviews...');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
