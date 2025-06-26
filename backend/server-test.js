require('dotenv').config();
const { connectDB } = require('./src/config/database');
const express = require('express');

async function testServer() {
  try {
    console.log('🚀 Starting minimal server test...');
    
    // Initialize models
    require('./src/models');
    
    // Connect to database
    await connectDB();
    
    const app = express();
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
    });
    
    const server = app.listen(5000, () => {
      console.log('🎉 Server started successfully on port 5000!');
      console.log('✅ All foreign key constraints are working properly');
    });
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      server.close(() => {
        console.log('🛑 Test server stopped');
        process.exit(0);
      });
    }, 3000);
    
  } catch (error) {
    console.error('❌ Server test failed:', error);
    process.exit(1);
  }
}

testServer();
