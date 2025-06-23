import React from 'react';
import { Card, CardContent } from '../ui/Card.jsx';
import { MapPin, Star, Navigation2, Plus, Edit2 } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

const EnhancedTopPlacesToVisit = ({ 
  places = [], 
  planId, 
  isLoading = false, 
  allowEdit = true 
}) => {

  const getGoogleMapsUrl = (coordinates) => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    }
    return null;
  };

  const getPlaceImageUrl = (placeName) => {
    // Generate a consistent image URL based on place name
    const imageIds = [
      'photo-1469474968028-56623f02e42e', // landscape
      'photo-1506905925346-21bda4d32df4', // mountain
      'photo-1501594907352-04cda38ebc29', // architecture
      'photo-1493246507139-91e8fad9978e', // architecture
      'photo-1518684079-3c830dcef090', // nature
      'photo-1476514525535-07fb3b4ae5f1', // lake
    ];
    const index = placeName ? placeName.length % imageIds.length : 0;
    return `https://images.unsplash.com/${imageIds[index]}?w=400&h=250&fit=crop&q=80`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Places Added Yet</h3>
          <p className="text-gray-600 mb-6">
            Discover amazing places to visit on your journey.
          </p>          {allowEdit && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Place
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, index) => {
          const placeName = typeof place === 'string' ? place : place.name;
          const coordinates = place.coordinates;
          const mapsUrl = getGoogleMapsUrl(coordinates);
          
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={getPlaceImageUrl(placeName)}
                  alt={placeName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {allowEdit && (
                    <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{(4.2 + (index * 0.1)).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {placeName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Must-visit destination
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {coordinates ? `${coordinates.lat?.toFixed(3)}, ${coordinates.lng?.toFixed(3)}` : 'Location'}
                      </span>
                    </div>
                    
                    {mapsUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(mapsUrl, '_blank')}
                        className="text-xs"
                      >
                        <Navigation2 className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allowEdit && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="text-center py-8">            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add More Places
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedTopPlacesToVisit;
