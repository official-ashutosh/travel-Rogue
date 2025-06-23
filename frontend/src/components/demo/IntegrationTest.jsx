import React, { useState } from 'react';
import { Button } from '../ui/Button.jsx';
import FeedbackSheet from '../common/FeedbackSheet.jsx';
import LocationAutoComplete from '../LocationAutoComplete.jsx';
import NewPlanForm from '../NewPlanForm.jsx';
import ConstantsDemo from './ConstantsDemo.jsx';

const IntegrationTest = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTest, setActiveTest] = useState('feedback');

  const tests = [
    { id: 'feedback', label: 'Feedback Test', component: 'feedback' },
    { id: 'autocomplete', label: 'Place Autocomplete Test', component: 'autocomplete' },
    { id: 'planform', label: 'Plan Creation Test', component: 'planform' },
    { id: 'constants', label: 'Constants Integration', component: 'constants' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integration Testing Page</h1>
          <p className="text-gray-600 mt-2">Test all integrated components and functionality</p>
        </div>

        {/* Test Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-white rounded-lg border">
            {tests.map((test) => (
              <Button
                key={test.id}
                variant={activeTest === test.id ? 'default' : 'ghost'}
                onClick={() => setActiveTest(test.id)}
                size="sm"
              >
                {test.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Test Content */}
        <div className="bg-white rounded-lg border p-6 min-h-96">
          {activeTest === 'feedback' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Feedback Component Test</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Click the feedback button below. It should open a modal with a form. 
                  Test submitting feedback and check if you get a success message.
                </p>
                <div className="flex gap-4 items-center">
                  <div className="p-3 border rounded-lg bg-gray-50">
                    <FeedbackSheet />
                  </div>
                  <span className="text-sm text-gray-500">← Click this feedback button</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800">Expected behavior:</h3>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Modal should open when button is clicked</li>
                    <li>• Form should have label dropdown and message textarea</li>
                    <li>• Submitting should show success alert</li>
                    <li>• Modal should close after successful submission</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTest === 'autocomplete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Place Autocomplete Test</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Type in the location field below. It should show suggestions from the backend.
                </p>
                <div className="max-w-md">
                  <LocationAutoComplete
                    placeholder="Search for a destination..."
                    onLocationSelect={(location) => {
                      setSelectedLocation(location);
                      console.log('Selected location:', location);
                    }}
                  />
                </div>
                {selectedLocation && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">Selected Location:</h3>
                    <p className="text-green-700">{selectedLocation.name}</p>
                    <p className="text-sm text-green-600">
                      Coordinates: {selectedLocation.lat}, {selectedLocation.lng}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800">Expected behavior:</h3>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Typing should show dropdown with suggestions</li>
                    <li>• Suggestions should come from backend API</li>
                    <li>• Clicking a suggestion should select it</li>
                    <li>• Selected location should appear above</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTest === 'planform' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Plan Creation Test</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Test creating a new plan with the form below. Try both regular and AI-generated options.
                </p>
                <div className="max-w-2xl">
                  <NewPlanForm closeModal={() => console.log('Modal would close')} />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800">Expected behavior:</h3>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Location autocomplete should work</li>
                    <li>• Date selection should work</li>
                    <li>• Activity and companion buttons should be selectable</li>
                    <li>• Both "Create Plan" and "Generate AI Plan" should work</li>
                    <li>• Success should redirect to plan detail page</li>
                    <li>• Errors should be handled gracefully</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTest === 'constants' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Constants Integration Test</h2>
              <p className="text-gray-600">
                All constants should be visible and properly integrated:
              </p>
              <ConstantsDemo />
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="font-medium mb-4">Integration Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Constants Integrated</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Backend APIs Ready</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">UI Components Ready</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Testing Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;
