const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  getPlanFeedback
} = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Protected routes
router.post('/', auth, createFeedback);
router.get('/my-feedback', auth, getUserFeedback);
router.get('/plan/:planId', auth, getPlanFeedback);

// Admin routes
router.get('/all', auth, adminOnly, getAllFeedback);
router.put('/:feedbackId', auth, adminOnly, updateFeedback);

router.delete('/:feedbackId', auth, deleteFeedback);

module.exports = router;
