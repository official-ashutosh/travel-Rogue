const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET: Check API configuration
router.get('/', async (req, res) => {
  try {
    const config = {
      database: {
        connected: false,
        error: null
      },
      maps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ? 'configured' : 'missing',
        keyLength: process.env.GOOGLE_MAPS_API_KEY?.length || 0
      },
      weather: {
        apiKey: process.env.OPENWEATHER_API_KEY ? 'configured' : 'missing'
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
      }
    };

    // Test database connection
    try {
      const result = await db.query('SELECT 1 as test');
      if (result.rows.length > 0) {
        config.database.connected = true;
      }
    } catch (error) {
      config.database.error = error.message;
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({
      error: 'Configuration check failed',
      details: error.message
    });
  }
});

module.exports = router;
