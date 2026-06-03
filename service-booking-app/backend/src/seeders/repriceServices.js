require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const connectDB = require('../config/database');

const ratesByCategory = {
  electrical: 150,
  plumbing: 120,
  carpentry: 140,
  painting: 180,
  cleaning: 80,
  landscaping: 90,
  'pest-control': 160,
  hvac: 200,
  'appliance-repair': 170,
  locksmith: 100
};

const repriceServices = async () => {
  await connectDB();

  let updated = 0;
  for (const [category, rate] of Object.entries(ratesByCategory)) {
    const result = await Service.updateMany({ category }, { $set: { basePrice: rate } });
    updated += result.modifiedCount || 0;
  }

  const clampResult = await Service.updateMany(
    {
      $or: [
        { basePrice: { $lt: 25 } },
        { basePrice: { $gt: 250 } }
      ]
    },
    [
      {
        $set: {
          basePrice: {
            $min: [250, { $max: [25, '$basePrice'] }]
          }
        }
      }
    ]
  );

  console.log(`Services repriced: ${updated}. Clamped: ${clampResult.modifiedCount || 0}.`);
  await mongoose.disconnect();
};

repriceServices().catch((error) => {
  console.error(error);
  process.exit(1);
});
