const express = require('express');
const router = express.Router();
const {
  createExpense,
  getPlanExpenses,
  getUserExpenses,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics
} = require('../controllers/expenseController');
const auth = require('../middleware/auth');
// const { param } = require('express-validator');

// Protected routes
router.post('/', auth, createExpense);
router.get('/my-expenses', auth, getUserExpenses);
router.get('/plan/:planId', auth, getPlanExpenses);
router.get('/plan/:planId/analytics', auth, getExpenseAnalytics);

router.put('/:expenseId', auth, updateExpense);

router.delete('/:expenseId', auth, deleteExpense);

module.exports = router;
