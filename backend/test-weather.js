const { generateWeatherDataForPlan } = require('./src/services/weatherService');

async function testWeatherGeneration() {
  console.log('Testing weather data generation...');
  
  try {
    const location = 'Paris';
    console.log(`Generating weather data for: ${location}`);
    
    const weatherData = await generateWeatherDataForPlan(location);
    console.log('Weather data generated successfully:');
    console.log(JSON.stringify(weatherData, null, 2));
    
    // Test with different locations
    const locations = ['Tokyo', 'New York', 'London', 'Sydney'];
    for (const loc of locations) {
      console.log(`\nTesting ${loc}...`);
      const data = await generateWeatherDataForPlan(loc);
      console.log(`${loc}: ${data.current.temperature}°C, ${data.current.description}`);
    }
    
  } catch (error) {
    console.error('Error testing weather generation:', error);
  }
}

testWeatherGeneration();
