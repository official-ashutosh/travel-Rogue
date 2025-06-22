const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET: List all published community plans
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM plans p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_published = true
      ORDER BY p.created_at DESC
      LIMIT 20
    `);
    
    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Error fetching community plans:', error);
    res.status(500).json({ error: 'Failed to fetch community plans' });
  }
});

// GET: Get a specific community plan
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;

    const result = await db.query(`
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM plans p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND p.is_published = true
    `, [planId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Community plan not found' });
    }

    res.json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Error fetching community plan:', error);
    res.status(500).json({ error: 'Failed to fetch community plan' });
  }
});

module.exports = router;
