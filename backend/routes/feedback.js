const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { message, label, planId } = req.body;
    
    // Get user info if authenticated, otherwise allow anonymous feedback
    let userId = null;
    let userEmail = null;
    
    // Check if user is authenticated
    if (req.headers.authorization) {
      try {
        const auth = require('../middleware/auth.js');
        const authCheck = new Promise((resolve, reject) => {
          auth(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        await authCheck;
        userId = req.user?.id;
        userEmail = req.user?.email;
      } catch (error) {
        // Continue without authentication - allow anonymous feedback
        console.log('Anonymous feedback submission');
      }
    }

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    if (!label) {
      return res.status(400).json({ error: 'Feedback label is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Feedback message is too long (max 1000 characters)' });
    }

    // For now, just log the feedback (in production, save to database)
    const feedback = {
      userId: userId || 'anonymous',
      userEmail: userEmail || 'anonymous',
      planId: planId || null,
      message: message.trim(),
      label,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    console.log('📝 New feedback received:', feedback);

    // TODO: In production, save feedback to database
    // await db.query('INSERT INTO feedback (user_id, plan_id, message, label, created_at) VALUES ($1, $2, $3, $4, NOW())', 
    //   [userId, planId, message, label]);

    res.status(201).json({ 
      success: true,
      message: 'Feedback submitted successfully',
      id: Date.now() // mock ID
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit feedback' 
    });
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
