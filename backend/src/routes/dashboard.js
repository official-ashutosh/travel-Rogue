const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Protected routes
router.get('/stats', auth, getDashboardStats);

// Admin routes
router.get('/admin/stats', auth, adminOnly, getAdminDashboardStats);

module.exports = router;
