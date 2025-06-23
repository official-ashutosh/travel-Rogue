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
  deleteAccount
} = require('../controllers/userController');

// All Testing Done.
const auth = require('../middleware/auth');

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.get('/credits', auth, getCredits);
router.post('/credits/reduce', auth, reduceCredits);

// Admin routes (you would add admin middleware here)
router.get('/all', auth, getAllUsers); // Add admin middleware
router.post('/:userId/credits/add', auth, addCredits); // Add admin middleware

// Account management
router.post('/deactivate', auth, deactivateAccount);
router.delete('/delete', auth, deleteAccount);

module.exports = router;
