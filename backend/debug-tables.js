require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function debugTableCreation() {
  try {
    console.log('🔍 Debugging table creation...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Enable SQL logging temporarily
    sequelize.options.logging = console.log;
    
    // Try to create just the User table first
    console.log('\n🔄 Creating User table...');
    const User = require('./src/models/User');
    await User.sync({ force: true, logging: console.log });
    console.log('✅ User table created successfully');
    
    // Check the User table structure
    const [userTable] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 User table columns:');
    userTable.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Now try to create the Expense table
    console.log('\n🔄 Creating Expense table...');
    const Expense = require('./src/models/Expense');
    await Expense.sync({ force: true, logging: console.log });
    console.log('✅ Expense table created successfully');
    
    console.log('🎉 Table creation test successful!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Table creation failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

debugTableCreation();
