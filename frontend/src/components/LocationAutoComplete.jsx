import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useMap } from '../contexts/MapProvider.jsx';

const LocationAutoComplete = ({ onLocationSelect, placeholder = "Enter location...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const { isLoaded, geocodeLocation } = useMap();

  // Helper to load Google Maps JS API if not already loaded
  function loadGoogleMapsScript(apiKey) {
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Search for locations using Google Places AutocompleteService
  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: searchQuery, types: ['(cities)'] }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const results = predictions.map(pred => ({
            name: pred.structured_formatting.main_text,
            address: pred.description,
            type: pred.types?.[0] || 'place',
            place_id: pred.place_id
          }));
          setSuggestions(results.slice(0, 5));
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocations(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onLocationSelect) {
      onLocationSelect(location);
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
            suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900">{location.name}</span>
              </button>
            ))
          ) : query.trim() && !isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              No locations found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationAutoComplete;
