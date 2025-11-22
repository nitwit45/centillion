import mongoose from 'mongoose';
import User from '../src/models/User';
import { config } from '../src/config';

async function makeAdmin(email: string, fullName?: string, password?: string) {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user to admin
      user = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true }
      );
      console.log(`✅ Successfully made existing user ${user!.fullName} (${user!.email}) an admin`);
    } else {
      // Create new admin user
      const defaultFullName = fullName || 'Admin User';
      const defaultPassword = password || 'Admin123!';

      const newUser = new User({
        id: `admin_${Date.now()}`,
        fullName: defaultFullName,
        email: email,
        age: '30',
        phone: '+1234567890',
        country: 'United States',
        password: defaultPassword, // Let the User model hash this
        role: 'admin',
        isVerified: true,
        isFirstLogin: true,
        passwordSet: true,
        profileCompleted: true,
        beautyFormSubmitted: false,
        beautyFormStatus: 'draft'
      });

      user = await newUser.save();
      console.log(`✅ Successfully created new admin user: ${user.fullName} (${user.email})`);
      console.log(`🔑 Default password: ${defaultPassword}`);
      console.log(`⚠️  Please change the password after first login!`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
}

// Get arguments from command line
const email = process.argv[2];
const fullName = process.argv[3];
const password = process.argv[4];

if (!email) {
  console.log('Usage: npm run make-admin <email> [fullName] [password]');
  console.log('Examples:');
  console.log('  npm run make-admin admin@admin.com');
  console.log('  npm run make-admin admin@admin.com "Admin User" "MySecurePass123!"');
  process.exit(1);
}

makeAdmin(email, fullName, password);
