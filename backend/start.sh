#!/bin/bash

# Travel Planner AI Backend Startup Script

echo "🚀 Starting Travel Planner AI Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure your variables."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check MongoDB connection
echo "🍃 Checking MongoDB connection..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-planner-ai')
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -ne 0 ]; then
    echo "❌ MongoDB connection failed. Please ensure MongoDB is running."
    exit 1
fi

# Start the application
echo "🎯 Starting the server..."
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    npm run dev
fi
