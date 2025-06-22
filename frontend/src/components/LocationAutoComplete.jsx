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

  // Mock location data for demo purposes (replace with real API)
  const mockLocations = [
    { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA, USA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago, IL, USA', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston, TX, USA', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix, AZ, USA', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia, PA, USA', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio, TX, USA', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego, CA, USA', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas, TX, USA', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose, CA, USA', lat: 37.3382, lng: -121.8863 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  ];

  // Search for locations
  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // Filter mock locations for demo
      const filtered = mockLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
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
