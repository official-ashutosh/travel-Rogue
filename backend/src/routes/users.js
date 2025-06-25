const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getCredits,
  reduceCredits,
  addCredits,
  getAllUsers,
  deactivateAccount,
  deleteAccount,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');

// All Testing Done.
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.get('/credits', auth, getCredits);
router.post('/credits/reduce', auth, reduceCredits);

// Admin routes
router.get('/all', auth, adminOnly, getAllUsers);
router.post('/:userId/credits/add', auth, adminOnly, addCredits);
router.put('/:userId/status', auth, adminOnly, updateUserStatus);
router.delete('/:userId', auth, adminOnly, deleteUser);

// Account management
router.post('/deactivate', auth, deactivateAccount);
router.delete('/delete', auth, deleteAccount);

module.exports = router;
