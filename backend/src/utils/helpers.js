const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate random token
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create response object
const createResponse = (status, message, data = null) => {
  const response = { status, message };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

// Paginate results
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

// Clean object (remove undefined/null values)
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
};

// Validate ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Calculate expense totals by category
const calculateExpenseTotals = (expenses) => {
  const totals = {
    food: 0,
    commute: 0,
    shopping: 0,
    gifts: 0,
    accomodations: 0,
    others: 0,
    total: 0
  };

  expenses.forEach(expense => {
    totals[expense.category] += expense.amount;
    totals.total += expense.amount;
  });

  return totals;
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate plan sharing URL
const generatePlanSharingUrl = (planId, baseUrl = process.env.FRONTEND_URL) => {
  return `${baseUrl}/plans/${planId}`;
};

module.exports = {
  generateToken,
  generateRandomToken,
  createResponse,
  paginate,
  cleanObject,
  generateUniqueFilename,
  isValidObjectId,
  calculateExpenseTotals,
  formatDate,
  generatePlanSharingUrl
};
