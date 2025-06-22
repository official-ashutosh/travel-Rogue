import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper.jsx';
import { Cloud, Sun, CloudRain } from 'lucide-react';

const Weather = ({ placeName = '' }) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!placeName) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual weather API call
        // Mock weather data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather({
          temperature: '24°C',
          condition: 'Partly Cloudy',
          humidity: '65%',
          windSpeed: '12 km/h',
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [placeName]);

  if (!placeName) {
    return null;
  }

  if (isLoading) {
    return (
      <SectionWrapper id="weather">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  const getWeatherIcon = (condition) => {
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="w-6 h-6" />;
    if (condition.toLowerCase().includes('cloud')) return <Cloud className="w-6 h-6" />;
    return <Sun className="w-6 h-6" />;
  };

  return (
    <SectionWrapper id="weather">
      <div className="flex items-center space-x-2 mb-4">
        <Cloud className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Current Weather in {placeName}
        </h2>
      </div>
      
      {weather ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {getWeatherIcon(weather.condition)}
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {weather.temperature}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {weather.condition}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-green-700 dark:text-green-300">
              Humidity
            </div>
            <div className="text-xl text-green-600 dark:text-green-400">
              {weather.humidity}
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
              Wind Speed
            </div>
            <div className="text-xl text-yellow-600 dark:text-yellow-400">
              {weather.windSpeed}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
              Status
            </div>
            <div className="text-xl text-purple-600 dark:text-purple-400">
              Good for travel
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Weather information not available
        </div>
      )}
    </SectionWrapper>
  );
};

export default Weather;
