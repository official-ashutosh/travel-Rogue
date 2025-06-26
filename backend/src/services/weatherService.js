const axios = require('axios');

// Generate weather data for a plan based on location
const generateWeatherDataForPlan = async (locationName) => {
  try {
    console.log('Generating weather data for:', locationName);
    
    if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'a5f2bbf9e0cd0082dc1dd6c267ee1b5b') {
      console.warn('OpenWeather API key not configured or using default, using mock weather data');
      return generateMockWeatherData(locationName);
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Add timeout to prevent hanging requests
    const timeout = 5000; // 5 seconds
    
    // Get current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationName)}&appid=${apiKey}&units=metric`;
    
    // Get forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(locationName)}&appid=${apiKey}&units=metric&cnt=40`;
    
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(currentWeatherUrl, { timeout }),
      axios.get(forecastUrl, { timeout })
    ]);
    
    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;
    
    // Process forecast data (group by day and get daily min/max)
    const dailyForecasts = processForecastData(forecastData.list);
    
    // Generate seasonal data and tips based on location
    const seasonalData = generateSeasonalData(locationName);
    
    console.log('Weather data generated successfully for:', locationName);
    
    return {
      current: {
        temperature: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        wind_speed: currentData.wind.speed,
        timestamp: new Date()
      },
      forecast: dailyForecasts.slice(0, 5), // Next 5 days
      seasonal: seasonalData.seasonal
    };
    
  } catch (error) {
    console.warn('Error fetching weather data, using mock data:', error.message);
    return generateMockWeatherData(locationName);
  }
};

// Process forecast data to get daily min/max temperatures
const processForecastData = (forecastList) => {
  const dailyData = {};
  
  forecastList.forEach(forecast => {
    const date = new Date(forecast.dt * 1000).toDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date: date,
        temperatures: [],
        descriptions: [],
        icons: [],
        humidities: [],
        wind_speeds: []
      };
    }
    
    dailyData[date].temperatures.push(forecast.main.temp);
    dailyData[date].descriptions.push(forecast.weather[0].description);
    dailyData[date].icons.push(forecast.weather[0].icon);
    dailyData[date].humidities.push(forecast.main.humidity);
    dailyData[date].wind_speeds.push(forecast.wind.speed);
  });
  
  return Object.values(dailyData).map(day => ({
    date: day.date,
    temperature: {
      min: Math.round(Math.min(...day.temperatures)),
      max: Math.round(Math.max(...day.temperatures))
    },
    description: day.descriptions[0], // Most common description
    icon: day.icons[0],
    humidity: Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length),
    wind_speed: day.wind_speeds.reduce((a, b) => a + b, 0) / day.wind_speeds.length
  }));
};

// Generate seasonal data based on location
const generateSeasonalData = (locationName) => {
  // This is a simplified version - in a real app, you'd have a database of seasonal data
  const locationLower = locationName.toLowerCase();
  
  let seasonal;
  
  // Basic seasonal data for different regions
  if (locationLower.includes('tokyo') || locationLower.includes('japan')) {
    seasonal = {
      spring: {
        temperature_range: "10-20°C (50-68°F)",
        description: "Mild and pleasant with cherry blossoms",
        activities: ["Cherry blossom viewing", "Temple visits", "Outdoor festivals"]
      },
      summer: {
        temperature_range: "25-35°C (77-95°F)",
        description: "Hot and humid with frequent rain",
        activities: ["Indoor attractions", "Summer festivals", "Beach trips"]
      },
      autumn: {
        temperature_range: "15-25°C (59-77°F)",
        description: "Cool and comfortable with beautiful fall colors",
        activities: ["Fall foliage viewing", "Hiking", "Cultural activities"]
      },
      winter: {
        temperature_range: "5-15°C (41-59°F)",
        description: "Cold and dry with occasional snow",
        activities: ["Hot springs", "Winter illuminations", "Indoor dining"]
      }
    };
  } else if (locationLower.includes('manali') || locationLower.includes('india')) {
    seasonal = {
      spring: {
        temperature_range: "15-25°C (59-77°F)",
        description: "Pleasant weather with blooming flowers",
        activities: ["Trekking", "Sightseeing", "Photography"]
      },
      summer: {
        temperature_range: "20-30°C (68-86°F)",
        description: "Peak tourist season with comfortable weather",
        activities: ["Adventure sports", "Camping", "Valley tours"]
      },
      autumn: {
        temperature_range: "10-20°C (50-68°F)",
        description: "Cool weather with clear mountain views",
        activities: ["Trekking", "Cultural tours", "Apple picking"]
      },
      winter: {
        temperature_range: "-5-10°C (23-50°F)",
        description: "Cold with heavy snowfall",
        activities: ["Snow activities", "Indoor cultural experiences", "Hot springs"]
      }
    };
  } else {
    // Generic seasonal data
    seasonal = {
      spring: {
        temperature_range: "15-25°C (59-77°F)",
        description: "Mild and pleasant weather",
        activities: ["Outdoor activities", "Sightseeing", "Nature walks"]
      },
      summer: {
        temperature_range: "25-35°C (77-95°F)",
        description: "Warm weather, peak tourist season",
        activities: ["Beach activities", "Outdoor sports", "Festivals"]
      },
      autumn: {
        temperature_range: "15-25°C (59-77°F)",
        description: "Cool and comfortable",
        activities: ["Cultural activities", "Hiking", "Photography"]
      },
      winter: {
        temperature_range: "5-15°C (41-59°F)",
        description: "Cool to cold weather",
        activities: ["Indoor attractions", "Cultural experiences", "Warm cuisine"]
      }
    };
  }
  
  return { seasonal };
};

// Generate mock weather data when API is not available
const generateMockWeatherData = (locationName) => {
  const mockCurrentWeather = {
    temperature: Math.floor(Math.random() * 25) + 15, // 15-40°C
    feels_like: Math.floor(Math.random() * 25) + 15,
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    description: "partly cloudy",
    icon: "02d",
    wind_speed: Math.floor(Math.random() * 10) + 2, // 2-12 m/s
    timestamp: new Date()
  };
  
  const mockForecast = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.toDateString(),
      temperature: {
        min: Math.floor(Math.random() * 15) + 10,
        max: Math.floor(Math.random() * 15) + 25
      },
      description: ["sunny", "partly cloudy", "cloudy", "light rain"][Math.floor(Math.random() * 4)],
      icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      wind_speed: Math.floor(Math.random() * 8) + 2
    };
  });
  
  const seasonalData = generateSeasonalData(locationName);
  
  return {
    current: mockCurrentWeather,
    forecast: mockForecast,
    seasonal: seasonalData.seasonal
  };
};

module.exports = {
  generateWeatherDataForPlan,
  generateMockWeatherData
};
