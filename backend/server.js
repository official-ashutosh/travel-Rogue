const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const communityPlanRoutes = require('./routes/community-plans');
const weatherRoutes = require('./routes/weather');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const configRoutes = require('./routes/config');
const feedbackRoutes = require('./routes/feedback');
const locationRoutes = require('./routes/locations');

// Import database connection
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 10000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware with custom format
const customMorganFormat = (tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens['response-time'](req, res);
  const contentLength = tokens.res(req, res, 'content-length') || '-';
  const userAgent = tokens['user-agent'](req, res);
  const referer = tokens.referrer(req, res) || '-';
  
  const date = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Color codes for different status codes
  const getStatusColor = (status) => {
    const code = parseInt(status);
    if (code >= 200 && code < 300) return '\x1b[32m'; // Green for success
    if (code >= 300 && code < 400) return '\x1b[33m'; // Yellow for redirect
    if (code >= 400 && code < 500) return '\x1b[31m'; // Red for client error
    if (code >= 500) return '\x1b[35m'; // Magenta for server error
    return '\x1b[0m'; // Reset
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return '\x1b[36m'; // Cyan
      case 'POST': return '\x1b[32m'; // Green
      case 'PUT': return '\x1b[33m'; // Yellow
      case 'DELETE': return '\x1b[31m'; // Red
      case 'PATCH': return '\x1b[35m'; // Magenta
      default: return '\x1b[0m'; // Reset
    }
  };

  const statusColor = getStatusColor(status);
  const methodColor = getMethodColor(method);
  const reset = '\x1b[0m';

  // Get browser name from user agent
  const getBrowser = (userAgent) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const browser = getBrowser(userAgent);

  return [
    `🕐 ${date}`,
    `${methodColor}${method.padEnd(6)}${reset}`,
    `${statusColor}${status}${reset}`,
    `📄 ${contentLength.toString().padStart(6)} bytes`,
    `⚡ ${responseTime}ms`,
    `🌐 ${url}`,
    `🔗 ${referer !== '-' ? referer.replace('http://localhost:3000', 'localhost') : 'direct'}`,
    `🖥️  ${browser}`
  ].join(' │ ');
};

app.use(morgan(customMorganFormat));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/community-plans', communityPlanRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/config', configRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/locations', locationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Travel Rogue API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Travel Rogue API Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`� API Base: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  console.log('📋 Available endpoints:');
  console.log('   • GET  /api/health - Health check');
  console.log('   • POST /api/auth/* - Authentication');
  console.log('   • GET  /api/plans/* - Travel plans');
  console.log('   • POST /api/ai/* - AI generation');
  console.log('   • GET  /api/weather/* - Weather data');
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
