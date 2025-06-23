const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  requestPasswordReset,
  resetPassword,
  changePassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes - All Tested
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);

router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', auth, getMe);
router.post('/change-password', auth, changePassword);

module.exports = router;
