require('dotenv').config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

const DEMO_EMAIL = 'demo@hashnode.dev';
const DEMO_PASSWORD = 'password123';

const seed = async () => {
  if (process.env.USE_MEMORY_DB === 'true') {
    console.warn(
      '⚠️  USE_MEMORY_DB=true starts a temporary database for this seed process.\n' +
        '    The seeded data is discarded when it exits. Use a real MONGO_URI to persist seed data.'
    );
  }

  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL }).select('+password');

  if (user) {
    user.name = 'Demo Author';
    user.bio = 'Writing about JavaScript, Node.js, and building useful things for the web.';
    user.password = DEMO_PASSWORD;
    await user.save();
    console.log(`Updated demo user: ${DEMO_EMAIL}`);
  } else {
    user = await User.create({
      name: 'Demo Author',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      bio: 'Writing about JavaScript, Node.js, and building useful things for the web.',
    });
    console.log(`Created demo user: ${DEMO_EMAIL}`);
  }

  console.log(`Demo credentials: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await disconnectDB();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
