import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const loadGoogleMapsScript = (apiKey) => {
  if (window.google && window.google.maps && window.google.maps.places) return Promise.resolve();
  if (document.getElementById('google-maps-script')) return new Promise(resolve => {
    const check = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const PlacesAutoComplete = ({ onPlaceSelect, placeholder = "Search places...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Search for places using Google Places JS API
  const searchPlaces = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      await loadGoogleMapsScript(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: searchQuery, types: ['geocode'] }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && Array.isArray(predictions)) {
          const results = predictions.map(pred => ({
            name: pred.structured_formatting.main_text,
            address: pred.description,
            type: pred.types?.[0] || 'place',
            place_id: pred.place_id
          }));
          setSuggestions(results.slice(0, 8));
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Places search error:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchPlaces(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setQuery(place.name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get type icon
  const getTypeIcon = (type) => {
    if (!type) return '📍';
    if (Array.isArray(type)) type = type[0];
    switch (type) {
      case 'landmark':
      case 'point_of_interest':
        return '🏛️';
      case 'museum':
        return '🏛️';
      case 'park':
        return '🌳';
      case 'attraction':
        return '🎯';
      default:
        return '📍';
    }
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || query.trim()) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((place, index) => (
              <button
                key={index}
                onClick={() => handlePlaceSelect(place)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-lg flex-shrink-0">{getTypeIcon(place.type)}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{place.name}</div>
                  <div className="text-sm text-gray-500">{place.address}</div>
                </div>
              </button>
            ))
          ) : query.trim() && !isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              No places found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PlacesAutoComplete;
