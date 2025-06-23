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

// Protected routes
router.post('/', auth, createFeedback);
router.get('/my-feedback', auth, getUserFeedback);
router.get('/plan/:planId', auth, getPlanFeedback);

// Admin routes (add admin middleware)
router.get('/all', auth, getAllFeedback); // Add admin middleware
router.put('/:feedbackId', auth, updateFeedback); // Add admin middleware

router.delete('/:feedbackId', auth, deleteFeedback);

module.exports = router;
