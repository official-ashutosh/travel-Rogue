require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Query to get all tables
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Current tables in database:');
    results.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    if (results.length === 0) {
      console.log('⚠️  No tables found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking tables:', error);
    process.exit(1);
  }
}

checkTables();
