const express = require('express');
const router = express.Router();
const {
  createStripeSession,
  createRazorpayOrder,
  verifyStripePayment,
  verifyRazorpayPayment,
  getPaymentHistory,
  getCreditPackages,
  handleStripeWebhook
} = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Public routes
router.get('/packages', getCreditPackages);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.post('/stripe/create-session', auth, createStripeSession);

router.post('/razorpay/create-order', auth, createRazorpayOrder);

router.post('/stripe/verify', auth, verifyStripePayment);

router.post('/razorpay/verify', auth, verifyRazorpayPayment);

router.get('/history', auth, getPaymentHistory);

module.exports = router;
