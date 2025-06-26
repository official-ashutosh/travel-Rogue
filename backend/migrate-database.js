const { Sequelize } = require('sequelize');
const path = require('path');

// Import all models
require('./src/models/User');
require('./src/models/Plan');
require('./src/models/Access');
require('./src/models/Expense');
require('./src/models/Feedback');
require('./src/models/Invite');
require('./src/models/Payment');
require('./src/models/PlanSettings');

const { sequelize } = require('./src/config/database');

async function migrateDatabase() {
  try {
    console.log('\n' + '═'.repeat(60));
    console.log('🔄 Starting Database Migration');
    console.log('═'.repeat(60));

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');

    // Force sync - this will drop all tables and recreate them
    console.log('⚠️  WARNING: This will drop all existing tables and data!');
    console.log('🔄 Dropping and recreating all tables...');
    
    await sequelize.sync({ force: true });
    
    console.log('✅ All tables created successfully!');
    console.log('═'.repeat(60));
    console.log('📝 Tables created:');
    console.log('   - users');
    console.log('   - plans');
    console.log('   - accesses');
    console.log('   - expenses');
    console.log('   - feedbacks');
    console.log('   - invites');
    console.log('   - payments');
    console.log('   - plan_settings');
    console.log('═'.repeat(60));
    console.log('✅ Database migration completed successfully!');
    console.log('💡 You can now start your server normally.');
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  console.log('\n🚀 Database Migration Script');
  console.log('This script will set up your PostgreSQL database schema.');
  
  // Run migration
  migrateDatabase();
}

module.exports = { migrateDatabase };
