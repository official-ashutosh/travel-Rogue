const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  userId: {
    type: String
  },
  email: {
    type: String,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['viewer', 'editor', 'admin'],
    default: 'viewer'
  },
  grantedBy: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Access', accessSchema);
