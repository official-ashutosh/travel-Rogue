const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Comprehensive Gemini AI plan generation function
const generateCompletePlanWithGemini = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash-latest' });

    // Create comprehensive prompt with user data and expected format
    const prompt = createDetailedPrompt(userInput);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    const parsedData = parseGeminiResponse(text);
    return parsedData;

  } catch (error) {
    console.error('Gemini AI API Error:', error);
    throw new Error(`Failed to generate AI content: ${error.message}`);
  }
};

// Create detailed prompt for Gemini with all user information
const createDetailedPrompt = (userInput) => {
  const {
    nameoftheplace,
    userPrompt,
    startDate,
    endDate,
    numberOfDays,
    budgetRange,
    travelStyle,
    groupSize,
    interests,
    accommodationType,
    transportPreference
  } = userInput;

  return `
You are an expert travel planner. Create a comprehensive travel plan based on the following user requirements:

**USER REQUIREMENTS:**
- Destination: ${nameoftheplace}
- User Request: ${userPrompt}
- Travel Dates: ${startDate ? `From ${startDate}` : 'Not specified'} ${endDate ? `to ${endDate}` : ''}
- Duration: ${numberOfDays || 'Not specified'} days
- Budget Range: ${budgetRange || 'Not specified'}
- Travel Style: ${travelStyle || 'Not specified'} (e.g., luxury, budget, backpacker, family-friendly)
- Group Size: ${groupSize || 'Not specified'} people
- Interests: ${interests ? interests.join(', ') : 'Not specified'} (e.g., culture, adventure, food, history, nature)
- Accommodation Type: ${accommodationType || 'Not specified'} (e.g., hotel, hostel, airbnb, resort)
- Transport Preference: ${transportPreference || 'Not specified'} (e.g., public transport, rental car, walking, cycling)

**IMPORTANT: You must respond with a valid JSON object that matches this exact structure. Do not include any text before or after the JSON:**

{
  "abouttheplace": "A comprehensive 2-3 sentence description of the destination highlighting its unique characteristics and appeal",
  "adventuresactivitiestodo": [
    "Activity 1 with brief description",
    "Activity 2 with brief description",
    "Activity 3 with brief description",
    "Activity 4 with brief description",
    "Activity 5 with brief description"
  ],
  "topplacestovisit": [
    {
      "name": "Famous Landmark 1",
      "coordinates": {
        "lat": 12.3456,
        "lng": 12.3456
      }
    },
    {
      "name": "Famous Landmark 2", 
      "coordinates": {
        "lat": 12.3456,
        "lng": 12.3456
      }
    },
    {
      "name": "Famous Landmark 3",
      "coordinates": {
        "lat": 12.3456,
        "lng": 12.3456
      }
    }
  ],
  "packingchecklist": [
    "Essential item 1 based on destination and season",
    "Essential item 2 based on activities planned",
    "Essential item 3 based on weather/climate",
    "Essential item 4 based on cultural considerations",
    "Essential item 5 based on specific user needs"
  ],
  "localcuisinerecommendations": [
    "Must-try local dish 1 with brief description",
    "Must-try local dish 2 with brief description", 
    "Must-try local dish 3 with brief description",
    "Popular local beverage or dessert",
    "Street food or local specialty"
  ],
  "besttimetovisit": "Detailed explanation of the best time to visit including weather, crowds, pricing, and seasonal highlights",
  "itinerary": [
    {
      "title": "Day 1: Arrival and Introduction",
      "activities": {
        "morning": [
          {
            "itineraryItem": "Arrival and check-in",
            "briefDescription": "Get settled and oriented"
          }
        ],
        "afternoon": [
          {
            "itineraryItem": "First exploration activity",
            "briefDescription": "Gentle introduction to the destination"
          }
        ],
        "evening": [
          {
            "itineraryItem": "Welcome dinner",
            "briefDescription": "Taste local cuisine"
          }
        ]
      }
    }
  ]
}

**CRITICAL REQUIREMENTS:**
1. Use REAL coordinates (latitude and longitude) for all places
2. Tailor all recommendations to the specific destination
3. Consider the user's budget, travel style, and interests in all suggestions
4. Provide practical, actionable advice
5. Ensure all arrays have at least 3-5 items
6. Make sure the JSON is valid and parseable
7. Do not include any markdown formatting or code blocks
8. Respond ONLY with the JSON object, no additional text
9. Use the exact field names and structure shown above

Generate a comprehensive travel plan now:`;
};

// Parse Gemini response and handle potential formatting issues
const parseGeminiResponse = (text) => {
  try {
    // Clean the response text
    let cleanedText = text.trim();
    
    // Remove any markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd);
    }

    const parsedData = JSON.parse(cleanedText);
    
    // Validate that we have the required structure
    if (!parsedData.abouttheplace || !parsedData.adventuresactivitiestodo) {
      throw new Error('Invalid response structure from Gemini');
    }

    return parsedData;

  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', text);
    
    // Return fallback data if parsing fails
    return {
      abouttheplace: "A wonderful destination with rich culture and beautiful scenery.",
      adventuresactivitiestodo: [
        "Explore the main attractions",
        "Try local cuisine",
        "Visit cultural sites",
        "Enjoy outdoor activities",
        "Experience local nightlife"
      ],
      topplacestovisit: [
        {
          name: "Main Tourist Attraction",
          coordinates: { lat: 0, lng: 0 }
        }
      ],
      packingchecklist: [
        "Comfortable walking shoes",
        "Camera",
        "Sunscreen",
        "Appropriate clothing",
        "Travel documents"
      ],
      localcuisinerecommendations: [
        "Local specialty dish",
        "Traditional breakfast",
        "Popular street food",
        "Regional beverage",
        "Famous dessert"
      ],
      besttimetovisit: "The best time to visit varies depending on your preferences for weather and activities.",
      itinerary: [
        {
          title: "Day 1: Exploration",
          activities: {
            morning: [
              {
                itineraryItem: "Start exploring",
                briefDescription: "Begin your adventure"
              }
            ],
            afternoon: [
              {
                itineraryItem: "Continue sightseeing",
                briefDescription: "Visit main attractions"
              }
            ],
            evening: [
              {
                itineraryItem: "Dinner and relaxation",
                briefDescription: "End the day with good food"
              }
            ]
          }
        }
      ]
    };
  }
};

module.exports = {
  generateCompletePlanWithGemini
};
