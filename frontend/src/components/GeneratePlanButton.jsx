import React, { useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';
import { Input } from './ui/Input.jsx';
import { useNavigate } from 'react-router-dom';

const GeneratePlanButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const handleCreatePlan = () => {
    navigate('/plans/new');
  };

  return (
    <>
      <Button 
        onClick={handleCreatePlan}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Plan
      </Button>

      {/* Quick Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Quick Plan Creation
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDialog(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destination
                </label>
                <Input 
                  placeholder="Where do you want to go?"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePlan}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Create Detailed Plan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export { GeneratePlanButton };
export default GeneratePlanButton;
