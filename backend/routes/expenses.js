const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET: Get all expenses for a plan
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    // Verify user owns the plan
    const planCheck = await db.query(
      'SELECT id FROM plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const result = await db.query(
      'SELECT * FROM expenses WHERE plan_id = $1 ORDER BY created_at DESC',
      [planId]
    );

    res.json({ expenses: result.rows });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST: Create new expense
router.post('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const { description, amount, category, date } = req.body;
    const userId = req.user.id;

    // Verify user owns the plan
    const planCheck = await db.query(
      'SELECT id FROM plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const result = await db.query(
      'INSERT INTO expenses (plan_id, description, amount, category, expense_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [planId, description, amount, category, date]
    );

    res.status(201).json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// DELETE: Delete multiple expenses
router.delete('/multiple', async (req, res) => {
  try {
    const { expenseIds, planId } = req.body;
    const userId = req.user.id;

    if (!expenseIds || !Array.isArray(expenseIds) || expenseIds.length === 0) {
      return res.status(400).json({ error: 'No expense IDs provided' });
    }

    // Verify user owns the plan
    const planCheck = await db.query(
      'SELECT id FROM plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const placeholders = expenseIds.map((_, index) => `$${index + 2}`).join(',');
    const query = `DELETE FROM expenses WHERE plan_id = $1 AND id IN (${placeholders}) RETURNING *`;
    const values = [planId, ...expenseIds];

    const result = await db.query(query, values);

    res.json({ 
      message: `${result.rows.length} expenses deleted successfully`,
      deletedExpenses: result.rows 
    });
  } catch (error) {
    console.error('Error deleting expenses:', error);
    res.status(500).json({ error: 'Failed to delete expenses' });
  }
});

module.exports = router;
