const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Upload = require('../models/ExcelUpload');
const UserActivity = require('../models/UserActivity');

const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('Please set MONGO_URI in your .env before running this script.');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    // WARNING: remove all existing data
    console.log('Clearing Users, Uploads, Activities collections (this is irreversible)');
    await User.deleteMany({});
    await Upload.deleteMany({});
    await UserActivity.deleteMany({});

    const adminEmail = 'keerthigowli05@gmail.com';
    const adminPassword = 'Keerthi@05';

    const hashed = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      name: 'Default Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      loginCount: 0,
      uploadCount: 0,
    });

    console.log('Default admin created:', admin.email);
    console.log('Done. You can now login using the admin credentials.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
