require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    // Set a timeout for operations
    const timeout = setTimeout(() => {
      console.error('❌ Database operations timed out after 30 seconds');
      process.exit(1);
    }, 30000);
    
    // Authenticate first
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Drop all tables with CASCADE to handle foreign keys
    await sequelize.drop({ cascade: true, force: true });
    console.log('✅ All tables dropped');
    
    // Recreate with force and proper ordering
    await sequelize.sync({ force: true, alter: false });
    console.log('✅ All tables recreated');
    
    clearTimeout(timeout);
    console.log('🎉 Database reset complete!');
    
    // Close connection and exit
    await sequelize.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

resetDatabase();
