const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/stats', auth, getDashboardStats);

// Admin routes (add admin middleware)
router.get('/admin/stats', auth, getAdminDashboardStats); // Add admin middleware

module.exports = router;
