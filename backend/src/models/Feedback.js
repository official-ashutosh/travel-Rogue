const mongoose = require('mongoose');

const feedbackLabels = ['issue', 'idea', 'question', 'complaint', 'featurerequest', 'other'];

const feedbackSchema = new mongoose.Schema({  userId: {
    type: String
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  message: {
    type: String,
    trim: true
  },
  label: {
    type: String,
    enum: feedbackLabels
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  adminUserId: {
    type: String
  },
  responseDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
