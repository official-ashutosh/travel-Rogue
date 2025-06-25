const express = require('express');
const router = express.Router();
const {
  createPlan,
  getUserPlans,
  getPlan,
  updatePlan,
  deletePlan,
  getPublicPlans,
  togglePlanVisibility,
  getAllPlans,
  updatePlanStatus,
  deletePlanAdmin
} = require('../controllers/planController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validatePlanCreationInput } = require('../utils/planValidation');

// Public routes
router.get('/public', getPublicPlans);

// Protected routes
router.post('/', auth, validatePlanCreationInput, createPlan);
router.get('/my-plans', auth, getUserPlans);
router.get('/:planId', auth, getPlan);
router.put('/:planId', auth, updatePlan);
router.delete('/:planId', auth, deletePlan);

// Plan visibility
router.post('/:planId/toggle-visibility', auth, togglePlanVisibility);

// Admin routes
router.get('/all', auth, adminOnly, getAllPlans);
router.put('/:planId/status', auth, adminOnly, updatePlanStatus);
router.delete('/:planId/admin', auth, adminOnly, deletePlanAdmin);

module.exports = router;
