const axios = require('axios');

// Get current weather for a location
const getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(400).json({
        status: 'error',
        message: 'Weather service not configured'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;
    
    res.json({
      status: 'success',
      data: {
        location: weatherData.name,
        country: weatherData.sys.country,
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        wind_speed: weatherData.wind.speed,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch weather data'
    });
  }
};

// Get weather forecast for a location
const getWeatherForecast = async (req, res) => {
  try {
    const { location } = req.params;
    const { days = 5 } = req.query;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(400).json({
        status: 'error',
        message: 'Weather service not configured'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&cnt=${days * 8}`;
    
    const response = await axios.get(forecastUrl);
    const forecastData = response.data;
    
    // Group forecasts by day
    const dailyForecasts = forecastData.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        time: new Date(forecast.dt * 1000),
        temperature: forecast.main.temp,
        feels_like: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
        wind_speed: forecast.wind.speed
      });
      return acc;
    }, {});
    
    res.json({
      status: 'success',
      data: {
        location: forecastData.city.name,
        country: forecastData.city.country,
        forecasts: dailyForecasts
      }
    });
  } catch (error) {
    console.error('Weather forecast error:', error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch weather forecast'
    });
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast
};
