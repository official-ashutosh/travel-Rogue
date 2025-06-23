const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_rogue';
    
    console.log('\n' + '═'.repeat(55));
    console.log('🔗 MongoDB Database Connection');
    console.log('═'.repeat(55));
    console.log(`📍 URI: ${mongoUri}`);
    console.log('═'.repeat(55));

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`🗄️  Database: ${conn.connection.db.databaseName}`);
    console.log('═'.repeat(55) + '\n');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful close on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return mongoose.connection.db;
};

const closeConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

module.exports = {
  connectDB,
  getDb,
  closeConnection
};
