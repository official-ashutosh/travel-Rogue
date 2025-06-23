const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET: Search locations using Google Places API
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ locations: [] });
    }

    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not found in environment variables');
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    // Use Google Places API Text Search
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&type=locality|political&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await axios.get(googleApiUrl);
    const data = response.data;

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.error_message || data.status);
      return res.status(500).json({ error: 'Failed to search locations' });
    }

    // Transform Google Places results to our format
    const locations = data.results.slice(0, 8).map(place => {
      // Extract city and country from formatted_address
      const addressParts = place.formatted_address.split(', ');
      const country = addressParts[addressParts.length - 1];
      
      return {
        name: place.name,
        address: place.formatted_address,
        country: country,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        place_id: place.place_id
      };
    });

    res.json({ locations });
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

module.exports = router;
