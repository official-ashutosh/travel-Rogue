const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

// Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const { message, type = 'general', rating } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Feedback message is too long (max 1000 characters)' });
    }

    // For now, just log the feedback (in production, save to database)
    const feedback = {
      userId,
      userEmail: req.user.email,
      message: message.trim(),
      type,
      rating,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    console.log('📝 New feedback received:', feedback);

    // TODO: In production, save feedback to database
    // await db.query('INSERT INTO feedback (user_id, message, type, rating, created_at) VALUES ($1, $2, $3, $4, NOW())', 
    //   [userId, message, type, rating]);

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      id: Date.now() // mock ID
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get user's feedback history (optional)
router.get('/my-feedback', auth, async (req, res) => {
  try {
    // TODO: In production, fetch from database
    // const result = await db.query('SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    
    res.json({ 
      feedback: [], // result.rows in production
      message: 'Feedback history retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

module.exports = router;
