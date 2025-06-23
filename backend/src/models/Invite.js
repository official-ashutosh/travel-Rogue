const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  email: {
    type: String,
    lowercase: true
  },
  token: {
    type: String,
    unique: true
  },
  invitedBy: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days in seconds
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invite', inviteSchema);
