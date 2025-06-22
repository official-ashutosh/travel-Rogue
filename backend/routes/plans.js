const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET: List all plans for the current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// GET: Get a specific plan
router.get('/:planId', [
  param('planId').isInt().withMessage('Plan ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// POST: Create a new plan
router.post('/', [
  body('nameoftheplace').notEmpty().withMessage('Plan name is required'),
  body('abouttheplace').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nameoftheplace, abouttheplace, fromdate, todate, budget } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO plans (user_id, nameoftheplace, abouttheplace, fromdate, todate, budget) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, nameoftheplace, abouttheplace || '', fromdate, todate, budget]
    );

    res.status(201).json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// PUT: Update a plan
router.put('/:planId', [
  param('planId').isInt().withMessage('Plan ID must be a number'),
  body('nameoftheplace').optional().notEmpty().withMessage('Plan name cannot be empty'),
  body('abouttheplace').optional().isString(),
  body('budget').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const { nameoftheplace, abouttheplace, fromdate, todate, budget, is_published } = req.body;
    const userId = req.user.id;

    // Check if plan exists and belongs to user
    const existingPlan = await db.query(
      'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (existingPlan.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (nameoftheplace !== undefined) {
      updates.push(`nameoftheplace = $${paramIndex++}`);
      values.push(nameoftheplace);
    }
    if (abouttheplace !== undefined) {
      updates.push(`abouttheplace = $${paramIndex++}`);
      values.push(abouttheplace);
    }
    if (fromdate !== undefined) {
      updates.push(`fromdate = $${paramIndex++}`);
      values.push(fromdate);
    }
    if (todate !== undefined) {
      updates.push(`todate = $${paramIndex++}`);
      values.push(todate);
    }
    if (budget !== undefined) {
      updates.push(`budget = $${paramIndex++}`);
      values.push(budget);
    }
    if (is_published !== undefined) {
      updates.push(`is_published = $${paramIndex++}`);
      values.push(is_published);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(planId, userId);

    const query = `
      UPDATE plans 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
      RETURNING *
    `;

    const result = await db.query(query, values);
    res.json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// DELETE: Delete a plan
router.delete('/:planId', [
  param('planId').isInt().withMessage('Plan ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'DELETE FROM plans WHERE id = $1 AND user_id = $2 RETURNING *',
      [planId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully', plan: result.rows[0] });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
