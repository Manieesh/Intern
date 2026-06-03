require('dotenv').config();
const Booking = require('../models/Booking');
const connectDB = require('../config/database');

const generateServiceOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const ensureBookingOtps = async () => {
  await connectDB();

  const bookings = await Booking.find({
    $or: [
      { serviceOtp: { $exists: false } },
      { serviceOtp: null },
      { serviceOtp: '' }
    ]
  });

  for (const booking of bookings) {
    booking.serviceOtp = generateServiceOtp();
    await booking.save();
  }

  console.log(`Updated ${bookings.length} booking OTPs`);
  process.exit(0);
};

ensureBookingOtps().catch((error) => {
  console.error(error);
  process.exit(1);
});
