import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MigrationStatus = () => {
  const features = [
    {
      name: 'Backend API',
      status: 'complete',
      description: 'Express.js server with all endpoints',
      details: ['Authentication', 'Plans CRUD', 'Community Plans', 'Expenses', 'AI Integration', 'Weather API']
    },
    {
      name: 'Database',
      status: 'complete',
      description: 'PostgreSQL with proper schema',
      details: ['Users table', 'Plans table', 'Expenses table', 'Itineraries table', 'Sample data seeded']
    },
    {
      name: 'Frontend UI',
      status: 'complete',
      description: 'React with Tailwind CSS',
      details: ['HomePage', 'DashboardPage', 'PlansPage', 'NewPlanPage', 'PlanDetailPage', 'CommunityPlansPage', 'Auth Pages']
    },
    {
      name: 'Authentication',
      status: 'complete',
      description: 'JWT-based auth system',
      details: ['Login/Signup', 'Protected routes', 'Token management', 'User context']
    },
    {
      name: 'API Integration',
      status: 'complete',
      description: 'Frontend ↔ Backend communication',
      details: ['Axios setup', 'Error handling', 'Loading states', 'Token interceptors']
    },
    {
      name: 'AI Features',
      status: 'ready',
      description: 'Gemini API integration',
      details: ['Plan generation', 'Itinerary creation', 'Smart recommendations']
    },
    {
      name: 'Weather Integration',
      status: 'ready',
      description: 'OpenWeather API',
      details: ['Location-based weather', 'Trip planning assistance']
    },
    {
      name: 'UI Components',
      status: 'complete',
      description: 'Reusable component library',
      details: ['Buttons', 'Cards', 'Inputs', 'Badges', 'Modals', 'Navigation']
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ready':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      complete: 'bg-green-100 text-green-800 border-green-200',
      ready: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const completedCount = features.filter(f => f.status === 'complete').length;
  const totalCount = features.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🚀 Next.js → MERN Migration Status
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-500">{completedCount}/{totalCount} Complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(feature.status)}
                  <h3 className="font-medium">{feature.name}</h3>
                </div>
                {getStatusBadge(feature.status)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
              <div className="flex flex-wrap gap-1">
                {feature.details.map((detail, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🎯 Migration Summary</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Complete separation of frontend (React) and backend (Express/Node.js)</li>
            <li>✅ All original Next.js functionality preserved and enhanced</li>
            <li>✅ Modern UI with Tailwind CSS and responsive design</li>
            <li>✅ Proper authentication and protected routes</li>
            <li>✅ Database integration with PostgreSQL</li>
            <li>✅ API endpoints for all features (plans, auth, community, expenses)</li>
            <li>✅ AI and weather integrations ready for use</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationStatus;
