const express = require('express');
const router = express.Router();
const { 
  getCommunityPlans, 
  getCommunityPlan, 
  togglePlanLike, 
  getPopularPlans 
} = require('../controllers/communityController');
const auth = require('../middleware/auth');

// Get all public community plans
router.get('/', getCommunityPlans);

// Get popular community plans
router.get('/popular/trending', getPopularPlans);

// Get a specific public plan by ID
router.get('/:planId', getCommunityPlan);

// Like/Unlike a community plan (protected)
router.post('/:planId/like', auth, togglePlanLike);

module.exports = router;
