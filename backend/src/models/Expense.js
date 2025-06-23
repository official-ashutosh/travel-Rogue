const mongoose = require('mongoose');

const expenseCategories = ['food', 'commute', 'shopping', 'gifts', 'accomodations', 'others'];

const expenseSchema = new mongoose.Schema({  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  userId: {
    type: String
  },
  amount: {
    type: Number
  },
  purpose: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: expenseCategories
  },
  date: {
    type: String
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
