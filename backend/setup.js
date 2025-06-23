#!/usr/bin/env node

/**
 * Travel Planner AI Backend Setup Script
 * This script helps you get started with the backend setup
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Travel Planner AI Backend Setup');
console.log('===================================\n');

// Check if required files exist
const requiredFiles = [
  '.env',
  'package.json',
  'src/index.js',
  'src/config/database.js'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.log('❌ Missing required files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nPlease ensure all files are present before running the application.\n');
}

// Check .env configuration
if (fs.existsSync('.env')) {
  console.log('✅ .env file found');
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => 
    !envContent.includes(envVar) || envContent.includes(`${envVar}=your-`)
  );
  
  if (missingEnvVars.length > 0) {
    console.log('⚠️  Please configure these environment variables in .env:');
    missingEnvVars.forEach(envVar => console.log(`   - ${envVar}`));
    console.log('');
  } else {
    console.log('✅ Environment variables configured');
  }
} else {
  console.log('❌ .env file not found. Copy .env.example to .env and configure it.\n');
}

// Check node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies not installed. Run: npm install\n');
}

console.log('\n📋 Quick Start Commands:');
console.log('========================');
console.log('1. Install dependencies:     npm install');
console.log('2. Configure environment:    cp .env.example .env');
console.log('3. Start development:        npm run dev');
console.log('4. Start production:         npm start');
console.log('5. Run with Docker:          docker-compose up -d');

console.log('\n🔗 API Endpoints:');
console.log('=================');
console.log('Health Check:                GET  /health');
console.log('User Registration:           POST /api/auth/register');
console.log('User Login:                  POST /api/auth/login');
console.log('Create Plan:                 POST /api/plans');
console.log('Generate AI Content:         POST /api/plans/:planId/generate');
console.log('Get User Plans:              GET  /api/plans/my-plans');
console.log('Create Expense:              POST /api/expenses');
console.log('Send Invite:                 POST /api/invites');
console.log('Payment Integration:         POST /api/payments/stripe/create-session');

console.log('\n📚 Documentation:');
console.log('==================');
console.log('Full API documentation is available in README.md');
console.log('Example requests can be found in the Postman collection');

console.log('\n🎉 You\'re all set! Happy coding!');
console.log('=================================\n');
