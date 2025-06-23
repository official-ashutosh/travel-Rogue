const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const promptSuffix = `generate travel data according to the schema and in json format, do not return anything in your response outside of curly braces, generate response as per the function schema provided. Dates given, activity preference and travelling with may influence like 50% while generating plan.`;

// Schemas (converted from TypeScript)
const batch1Schema = {
  abouttheplace: 'string',
  besttimetovisit: 'string'
};

const batch2Schema = {
  adventuresactivitiestodo: 'array',
  localcuisinerecommendations: 'array',
  packingchecklist: 'array'
};

const batch3Schema = {
  itinerary: 'array',
  topplacestovisit: 'array'
};

const callGeminiApi = async (prompt, schema, description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return { error: 'Failed to parse AI response', rawResponse: text };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

const getPrompt = ({ userPrompt, activityPreferences, companion, fromDate, toDate }) => {
  let prompt = `${userPrompt}`;
  if (fromDate && toDate) prompt += `, from date-${fromDate} to date-${toDate}`;
  if (companion && companion.length > 0) prompt += `, travelling with-${companion}`;
  if (activityPreferences && activityPreferences.length > 0) prompt += `, activity preferences-${activityPreferences.join(",")}`;
  return prompt;
};

// POST: Generate place information (batch 1)
router.post('/generate-place-info', async (req, res) => {
  try {
    const { promptText } = req.body;
    
    if (!promptText) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    const prompt = `${promptText}, ${promptSuffix}`;
    const description = `Generate a description of information about a place or location according to the following schema:
      - About the Place: A string containing information about the place, comprising at least 50 words.
      - Best Time to Visit: A string specifying the best time to visit the place.
      Ensure that the function response adheres to the schema provided and is in JSON format.`;
    
    const result = await callGeminiApi(prompt, batch1Schema, description);
    res.json({ data: result });
  } catch (error) {
    console.error('Error generating place info:', error);
    res.status(500).json({ error: 'Failed to generate place information' });
  }
});

// POST: Generate recommendations (batch 2)
router.post('/generate-recommendations', async (req, res) => {
  try {
    const inputParams = req.body;
    
    if (!inputParams.userPrompt) {
      return res.status(400).json({ error: 'User prompt is required' });
    }

    const description = `Generate a description of recommendations for an adventurous trip according to the following schema:
      - Top Adventures Activities: An array listing top adventure activities to do, including at least 5 activities.
      - Local Cuisine Recommendations: An array providing recommendations for local cuisine to try during the trip.
      - Packing Checklist: An array containing items that should be included in the packing checklist for the trip.
      Ensure that the function response adheres to the schema provided and is in JSON format.`;
    
    const prompt = `${getPrompt(inputParams)}, ${promptSuffix}`;
    const result = await callGeminiApi(prompt, batch2Schema, description);
    res.json({ data: result });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// POST: Generate itinerary (batch 3)
router.post('/generate-itinerary', async (req, res) => {
  try {
    const inputParams = req.body;
    
    if (!inputParams.userPrompt) {
      return res.status(400).json({ error: 'User prompt is required' });
    }

    const description = `Generate a description of a travel itinerary and top places to visit according to the following schema:
      - Itinerary: An array containing details of the itinerary for the specified number of days.
      - Top Places to Visit: An array listing the top places to visit along with their coordinates.
      Ensure that the function response adheres to the schema provided and is in JSON format.`;
    
    const prompt = `${getPrompt(inputParams)}, ${promptSuffix}`;
    const result = await callGeminiApi(prompt, batch3Schema, description);
    res.json({ data: result });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// POST: Submit feedback
router.post('/feedback', async (req, res) => {
  try {
    const { planId, label, message } = req.body;
    
    if (!message || message.length < 2) {
      return res.status(400).json({ error: 'Message is required and must be at least 2 characters' });
    }

    // Here you would typically save to database
    // For now, just log and return success
    console.log('Feedback received:', {
      planId,
      label,
      message,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        planId,
        label,
        message,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
