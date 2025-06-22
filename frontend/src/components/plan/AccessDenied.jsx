import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            You don't have permission to view this plan. It may be private or you may not be the owner.
          </p>
          
          <div className="space-y-3">
            <Link to="/dashboard" className="block">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <Link to="/community-plans" className="block">
              <Button variant="outline" className="w-full">
                Browse Community Plans
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              If you think this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
