"use client";
import { useEffect, useState } from "react";

interface ConfigStatus {
  database: {
    connected: boolean;
    error: string | null;
  };
  maps: {
    apiKey: string;
    keyLength: number;
  };
  weather: {
    apiKey: string;
  };
  gemini: {
    apiKey: string;
  };
}

export function SystemHealthCheck() {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch config:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 bg-blue-50 border border-blue-200 rounded">
      ⏳ Checking system health...
    </div>;
  }

  if (!config) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded">
      ❌ Failed to check system health
    </div>;
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
      <h3 className="font-semibold text-gray-800">System Health Check</h3>
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${config.database.connected ? 'text-green-600' : 'text-red-600'}`}>
          {config.database.connected ? '✅' : '❌'} Database
        </span>
        {config.database.error && (
          <span className="text-xs text-red-500">({config.database.error})</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${config.maps.apiKey === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
          {config.maps.apiKey === 'configured' ? '✅' : '❌'} Google Maps API
        </span>
        <span className="text-xs text-gray-500">
          ({config.maps.keyLength} chars)
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${config.weather.apiKey === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
          {config.weather.apiKey === 'configured' ? '✅' : '❌'} Weather API
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${config.gemini.apiKey === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
          {config.gemini.apiKey === 'configured' ? '✅' : '❌'} Gemini AI API
        </span>
      </div>
    </div>
  );
}
