import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Navigation, Sunrise, Sun, Sunset, Plus, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

const EnhancedItinerary = ({ 
  itinerary = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {

  const renderTimeOfDayActivities = (activities, timeOfDay, timeIcon, colorClass) => {
    if (!activities || activities.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`flex items-center gap-2 font-medium mb-3 ${colorClass}`}>
          {timeIcon}
          <span className="capitalize">{timeOfDay}</span>
        </div>
        <div className="ml-6 space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className={`p-3 rounded-lg border-l-4 bg-${colorClass.split('-')[1]}-50 border-${colorClass.split('-')[1]}-400`}>
              <h4 className="font-medium text-gray-900">
                {activity.itineraryItem || activity.name || activity}
              </h4>
              {activity.briefDescription && (
                <p className="text-sm text-gray-600 mt-1">
                  {activity.briefDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-gray-100 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary || itinerary.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your day-by-day travel itinerary to make the most of your trip.
          </p>          {allowEdit && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {itinerary.map((day, dayIndex) => (
        <Card key={dayIndex} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {dayIndex + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {day.title || `Day ${dayIndex + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Day {dayIndex + 1} of your journey
                  </p>
                </div>
              </div>
              {allowEdit && (
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Day
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {day.activities ? (
              <div className="space-y-6">
                {/* Morning Activities */}
                {renderTimeOfDayActivities(
                  day.activities.morning,
                  'morning',
                  <Sunrise className="w-5 h-5" />,
                  'text-yellow-600'
                )}

                {/* Afternoon Activities */}
                {renderTimeOfDayActivities(
                  day.activities.afternoon,
                  'afternoon',
                  <Sun className="w-5 h-5" />,
                  'text-orange-600'
                )}

                {/* Evening Activities */}
                {renderTimeOfDayActivities(
                  day.activities.evening,
                  'evening',
                  <Sunset className="w-5 h-5" />,
                  'text-purple-600'
                )}
              </div>
            ) : (
              // Fallback for simple string/array format
              <div className="space-y-3">
                {Array.isArray(day) ? (
                  day.map((activity, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{activity}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{day}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {allowEdit && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="text-center py-8">            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Day
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedItinerary;
