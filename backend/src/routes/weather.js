const express = require('express');
const router = express.Router();
const { getCurrentWeather, getWeatherForecast } = require('../controllers/weatherController');

// Get current weather for a location
router.get('/current/:location', getCurrentWeather);

// Get weather forecast for a location
router.get('/forecast/:location', getWeatherForecast);

module.exports = router;
