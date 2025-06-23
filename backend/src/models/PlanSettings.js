const mongoose = require('mongoose');

const planSettingsSchema = new mongoose.Schema({  userId: {
    type: String
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  currencyCode: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  activityPreferences: [{
    type: String,
    trim: true
  }],
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date
  },
  companion: {
    type: String,
    trim: true
  },  isPublished: {
    type: Boolean,
    default: false
  },budget: {
    type: Number
  },
  accommodationType: {
    type: String,
    enum: ['hotel', 'hostel', 'airbnb', 'resort', 'other']
  },
  transportMode: {
    type: String,
    enum: ['flight', 'train', 'bus', 'car', 'bike', 'other']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanSettings', planSettingsSchema);
