const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET: Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT: Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex++} 
      RETURNING id, name, email, created_at
    `;

    const result = await db.query(query, values);
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// GET: Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get plan count
    const planCount = await db.query(
      'SELECT COUNT(*) as count FROM plans WHERE user_id = $1',
      [userId]
    );

    // Get published plan count
    const publishedPlanCount = await db.query(
      'SELECT COUNT(*) as count FROM plans WHERE user_id = $1 AND is_published = true',
      [userId]
    );

    // Get total expenses
    const totalExpenses = await db.query(`
      SELECT COALESCE(SUM(e.amount), 0) as total 
      FROM expenses e 
      JOIN plans p ON e.plan_id = p.id 
      WHERE p.user_id = $1
    `, [userId]);

    res.json({
      stats: {
        totalPlans: parseInt(planCount.rows[0].count),
        publishedPlans: parseInt(publishedPlanCount.rows[0].count),
        totalExpenses: parseFloat(totalExpenses.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
