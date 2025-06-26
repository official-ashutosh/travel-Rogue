require('dotenv').config();
console.log('🚀 Starting the backend server...');

// Import models to trigger any loading errors
try {
  require('./src/models');
  console.log('✅ Models loaded successfully');
} catch (error) {
  console.error('❌ Model loading failed:', error);
  process.exit(1);
}

// Start the server without database sync
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server running without database sync',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log('📝 Note: Database sync is disabled for testing');
});

// Auto-shutdown after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('🛑 Test server stopped');
    process.exit(0);
  });
}, 10000);

