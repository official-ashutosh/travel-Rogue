const axios = require('axios');

// Search locations using Google Places API
const searchLocations = async (req, res) => {
  try {
    const { query, types = 'geocode' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(400).json({
        status: 'error',
        message: 'Location search service not configured'
      });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placesUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    
    const params = {
      input: query,
      types: types,
      key: apiKey
    };
    
    const response = await axios.get(placesUrl, { params });
    
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }
    
    const suggestions = response.data.predictions.map(prediction => ({
      place_id: prediction.place_id,
      description: prediction.description,
      main_text: prediction.structured_formatting.main_text,
      secondary_text: prediction.structured_formatting.secondary_text,
      types: prediction.types
    }));
    
    res.json({
      status: 'success',
      data: suggestions
    });
    
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search locations'
    });
  }
};

// Get place details by place ID
const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res.status(400).json({
        status: 'error',
        message: 'Location details service not configured'
      });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
    
    const params = {
      place_id: placeId,
      fields: 'name,formatted_address,geometry,photos,rating,types,opening_hours,formatted_phone_number,website',
      key: apiKey
    };
    
    const response = await axios.get(detailsUrl, { params });
    
    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }
    
    const place = response.data.result;
    
    res.json({
      status: 'success',
      data: {
        place_id: placeId,
        name: place.name,
        address: place.formatted_address,
        location: place.geometry.location,
        rating: place.rating,
        types: place.types,
        phone: place.formatted_phone_number,
        website: place.website,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })),
        opening_hours: place.opening_hours
      }
    });
    
  } catch (error) {
    console.error('Location details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get location details'
    });
  }
};

// Get popular destinations
const getPopularDestinations = async (req, res) => {
  try {
    // This could be enhanced to use real data from your database
    const popularDestinations = [
      { name: 'Paris, France', country: 'France', type: 'City', popularity: 95 },
      { name: 'Tokyo, Japan', country: 'Japan', type: 'City', popularity: 90 },
      { name: 'New York, USA', country: 'United States', type: 'City', popularity: 88 },
      { name: 'London, England', country: 'United Kingdom', type: 'City', popularity: 85 },
      { name: 'Bali, Indonesia', country: 'Indonesia', type: 'Island', popularity: 82 },
      { name: 'Rome, Italy', country: 'Italy', type: 'City', popularity: 80 },
      { name: 'Dubai, UAE', country: 'United Arab Emirates', type: 'City', popularity: 78 },
      { name: 'Sydney, Australia', country: 'Australia', type: 'City', popularity: 75 }
    ];
    
    res.json({
      status: 'success',
      data: popularDestinations
    });
  } catch (error) {
    console.error('Popular destinations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get popular destinations'
    });
  }
};

module.exports = {
  searchLocations,
  getPlaceDetails,
  getPopularDestinations
};
