const mongoose = require('mongoose');

const paymentMethods = ['stripe', 'razorpay', 'paypal'];
const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

const paymentSchema = new mongoose.Schema({  paymentId: {
    type: String,
    unique: true
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    trim: true
  },
  amount: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  method: {
    type: String,
    required: true,
    enum: paymentMethods
  },  status: {
    type: String,
    enum: paymentStatuses,
    default: 'pending'
  },  userId: {
    type: String
  },
  creditsAdded: {
    type: Number
  },
  stripeSessionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
