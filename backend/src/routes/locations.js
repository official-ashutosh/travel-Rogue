const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search locations using Google Places API
router.get('/search', async (req, res) => {
  try {
    const { q, query } = req.query;
    const searchQuery = q || query;
    
    if (!searchQuery) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Google Maps API key not configured'
      });
    }

    // Use Google Places Text Search API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: searchQuery,
        key: GOOGLE_MAPS_API_KEY,
        type: 'locality|administrative_area_level_1|country'
      }
    });

    if (response.data.status === 'OK') {
      const locations = response.data.results.slice(0, 8).map(place => ({
        name: place.name,
        address: place.formatted_address,
        country: place.formatted_address.split(', ').pop(),
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        place_id: place.place_id,
        types: place.types
      }));

      res.json({
        status: 'success',
        locations: locations,
        count: locations.length
      });
    } else {
      console.log('Google Places API response:', response.data.status);
      res.json({
        status: 'success',
        locations: [],
        count: 0
      });
    }

  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search locations',
      error: error.message
    });
  }
});

// Get place details by place_id
router.get('/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Google Maps API key not configured'
      });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: 'name,formatted_address,geometry,types,photos'
      }
    });

    if (response.data.status === 'OK') {
      const place = response.data.result;
      res.json({
        status: 'success',
        place: {
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          place_id: placeId,
          types: place.types,
          photos: place.photos || []
        }
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Place not found'
      });
    }

  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get place details',
      error: error.message
    });
  }
});

// Get popular destinations (static data for now)
router.get('/popular', async (req, res) => {
  try {
    const popularDestinations = [
      { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
      { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
      { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
      { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
      { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
      { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
      { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 }
    ];

    res.json({
      status: 'success',
      locations: popularDestinations,
      count: popularDestinations.length
    });

  } catch (error) {
    console.error('Popular destinations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get popular destinations',
      error: error.message
    });
  }
});

module.exports = router;
