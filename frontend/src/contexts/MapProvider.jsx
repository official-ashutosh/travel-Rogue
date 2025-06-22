import React, { createContext, useContext, useState, useEffect } from 'react';

const MapContext = createContext({
  map: null,
  setMap: () => {},
  markers: [],
  setMarkers: () => {},
  isLoaded: false,
  loadError: null,
  selectedLocation: null,
  setSelectedLocation: () => {},
  mapConfig: {
    zoom: 10,
    center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  },
  setMapConfig: () => {},
});

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapConfig, setMapConfig] = useState({
    zoom: 10,
    center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  });

  // Load Google Maps script (optional)
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.log('Google Maps API key not configured - running without maps');
          setIsLoaded(true);
          return;
        }

        if (window.google && window.google.maps) {
          setIsLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setIsLoaded(true);
        };

        script.onerror = () => {
          setLoadError('Failed to load Google Maps');
          setIsLoaded(true); // Continue without maps
        };

        document.head.appendChild(script);
      } catch (error) {
        setLoadError(error.message);
        setIsLoaded(true); // Continue without maps
      }
    };

    loadGoogleMaps();
  }, []);

  // Add marker to map
  const addMarker = (marker) => {
    setMarkers(prev => [...prev, marker]);
  };

  // Remove marker from map
  const removeMarker = (markerId) => {
    setMarkers(prev => prev.filter(marker => marker.id !== markerId));
  };

  // Clear all markers
  const clearMarkers = () => {
    setMarkers([]);
  };

  // Update map center and zoom
  const updateMapConfig = (newConfig) => {
    setMapConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Get geocoded location (mock implementation when Google Maps unavailable)
  const geocodeLocation = async (address) => {
    if (window.google && window.google.maps) {
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              address: results[0].formatted_address,
              placeId: results[0].place_id,
            });
          } else {
            reject(new Error('Geocoding failed: ' + status));
          }
        });
      });
    } else {
      // Mock geocoding for when Google Maps is not available
      return Promise.resolve({
        lat: 40.7128,
        lng: -74.0060,
        address: address,
        placeId: 'mock-place-id',
      });
    }
  };

  const value = {
    map,
    setMap,
    markers,
    setMarkers,
    addMarker,
    removeMarker,
    clearMarkers,
    isLoaded,
    loadError,
    selectedLocation,
    setSelectedLocation,
    mapConfig,
    setMapConfig: updateMapConfig,
    geocodeLocation,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
