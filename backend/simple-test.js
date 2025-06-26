require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function simpleTest() {
  try {
    console.log('🔍 Testing simple database connection...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Try to create User table only
    const User = require('./src/models/User');
    await User.sync({ alter: false });
    console.log('✅ User table created/verified');
    
    // Check if we can insert a test user
    const testUser = await User.create({
      userId: 'test-user-123',
      email: 'test@example.com',
      password: 'hashedpassword123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('✅ Test user created:', testUser.userId);
    
    // Clean up test user
    await testUser.destroy();
    console.log('✅ Test user removed');
    
    console.log('🎉 Basic database operations working!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
    process.exit(1);
  }
}

simpleTest();
