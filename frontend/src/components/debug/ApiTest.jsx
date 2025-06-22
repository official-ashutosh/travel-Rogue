import React, { useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import api from '../../lib/api.js';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (endpoint, name) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const response = await api.get(endpoint);
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: true, 
          data: response.data,
          status: response.status 
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.response?.data || error.message,
          status: error.response?.status 
        } 
      }));
    }
    setLoading(prev => ({ ...prev, [name]: false }));
  };

  const tests = [
    { name: 'config', endpoint: '/config', label: 'Server Config' },
    { name: 'plans', endpoint: '/plans', label: 'User Plans' },
    { name: 'community', endpoint: '/community-plans', label: 'Community Plans' },
    { name: 'auth', endpoint: '/auth/me', label: 'Current User' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🔧 API Connectivity Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {tests.map(test => (
            <Button
              key={test.name}
              variant="outline"
              size="sm"
              onClick={() => testEndpoint(test.endpoint, test.name)}
              disabled={loading[test.name]}
            >
              {loading[test.name] ? 'Testing...' : test.label}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.entries(results).map(([name, result]) => (
            <div 
              key={name} 
              className={`p-2 rounded text-xs ${
                result.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <div className="font-medium">
                {name.toUpperCase()}: {result.success ? '✅ Success' : '❌ Failed'} 
                (Status: {result.status})
              </div>
              <pre className="mt-1 whitespace-pre-wrap">
                {JSON.stringify(result.success ? result.data : result.error, null, 2).slice(0, 200)}
                {JSON.stringify(result.success ? result.data : result.error, null, 2).length > 200 && '...'}
              </pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTest;
