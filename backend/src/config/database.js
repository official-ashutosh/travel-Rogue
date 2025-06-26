const { Sequelize } = require('sequelize');

// Create sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'akumar15'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'Travel-Rogue'}`,
  {
    dialect: 'postgres',
    logging: process.env.ENABLE_SQL_LOGGING === 'true' ? console.log : false,
    dialectOptions: {
      ssl: process.env.DATABASE_URL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    const databaseUrl = process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'akumar15'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'Travel-Rogue'}`;
    
    console.log('\n' + '═'.repeat(55));
    console.log('🔗 PostgreSQL Database Connection');
    console.log('═'.repeat(55));
    console.log(`📍 URI: ${databaseUrl.replace(/:[^:@]*@/, ':****@')}`);
    console.log('═'.repeat(55));

    await sequelize.authenticate();
    
    console.log('✅ PostgreSQL connected successfully!');
    console.log(`🗄️  Database: ${process.env.DB_NAME || 'Travel-Rogue'}`);
    console.log('═'.repeat(55) + '\n');

    // Sync database models in dependency order
    try {
      // Import models to ensure they're loaded
      const models = require('../models');
      
      // Create tables in dependency order
      console.log('🔄 Creating tables in dependency order...');
      
      // 1. Create User table first (no dependencies)
      await models.User.sync({ alter: false });
      console.log('✅ User table ready');
      
      // 2. Create Plan table (depends on User)
      await models.Plan.sync({ alter: false });
      console.log('✅ Plan table ready');
      
      // 3. Create dependent tables
      await Promise.all([
        models.Access.sync({ alter: false }),
        models.Expense.sync({ alter: false }),
        models.Feedback.sync({ alter: false }),
        models.Invite.sync({ alter: false }),
        models.Payment.sync({ alter: false }),
        models.PlanSettings.sync({ alter: false })
      ]);
      console.log('✅ All dependent tables ready');
      
      console.log('✅ Database tables synchronized!');
    } catch (syncError) {
      console.warn('⚠️  Individual table sync failed, trying full sync...');
      await sequelize.sync({ alter: false });
      console.log('✅ Database tables synchronized!');
    }

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('PostgreSQL connection closed through app termination');
      process.exit(0);
    });

    return sequelize;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
};

const getDb = () => {
  return sequelize;
};

const closeConnection = async () => {
  if (sequelize) {
    await sequelize.close();
    console.log('PostgreSQL connection closed.');
  }
};

module.exports = {
  connectDB,
  getDb,
  closeConnection,
  sequelize
};
