const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to call Gemini API
const callGeminiApi = async (prompt) => {
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

// GET: List all plans for the current user
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    
    const plans = await db.collection('plans')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// GET: Get a specific plan
router.get('/:planId', [
  param('planId').isMongoId().withMessage('Invalid plan ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const userId = req.user.id;
    const db = getDb();

    const plan = await db.collection('plans').findOne({
      _id: new ObjectId(planId),
      user_id: userId
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// POST: Create a new plan
router.post('/', [
  body('nameoftheplace').notEmpty().withMessage('Destination is required'),
  body('fromdate').notEmpty().withMessage('Start date is required'),
  body('todate').notEmpty().withMessage('End date is required'),
  body('abouttheplace').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { 
      nameoftheplace, 
      abouttheplace, 
      fromdate, 
      todate, 
      budget, 
      generateWithAI, 
      activityPreferences, 
      companion 
    } = req.body;
    
    const userId = req.user.id;
    const db = getDb();

    // Create the basic plan
    const planData = {
      user_id: userId,
      nameoftheplace,
      abouttheplace: abouttheplace || '',
      fromdate,
      todate,
      budget: budget || 0,
      activityPreferences: activityPreferences || [],
      companion: companion || '',
      created_at: new Date(),
      updated_at: new Date(),
      ai_generated: !!generateWithAI
    };

    // If AI generation is requested, generate AI content
    if (generateWithAI && process.env.GEMINI_API_KEY) {
      try {
        console.log('Generating AI content for plan...');
        
        // Build prompt based on user inputs
        let prompt = `Create a detailed travel plan for ${nameoftheplace}`;
        if (fromdate && todate) {
          const startDate = new Date(fromdate).toLocaleDateString();
          const endDate = new Date(todate).toLocaleDateString();
          prompt += ` from ${startDate} to ${endDate}`;
        }
        if (companion) prompt += ` travelling with ${companion}`;
        if (activityPreferences && activityPreferences.length > 0) {
          prompt += ` with interests in ${activityPreferences.join(', ')}`;
        }
        if (budget) prompt += ` with a budget of $${budget}`;
        if (abouttheplace) prompt += `. Additional details: ${abouttheplace}`;
        
        prompt += `

Please provide a comprehensive travel plan in JSON format with the following structure:
{
  "abouttheplace": "Detailed description of the destination (at least 50 words)",
  "besttimetovisit": "Best time to visit this place",
  "topplacestovisit": [
    {
      "name": "Place name",
      "description": "Description",
      "coordinates": {"lat": 0, "lng": 0}
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["Activity 1", "Activity 2"],
      "description": "Day description"
    }
  ],
  "adventuresactivitiestodo": ["Activity 1", "Activity 2"],
  "localcuisinerecommendations": ["Dish 1", "Dish 2"],
  "packingchecklist": ["Item 1", "Item 2"]
}

Only return valid JSON, no additional text.`;
        
        const aiContent = await callGeminiApi(prompt);
        
        if (aiContent && !aiContent.error) {
          planData.ai_content = aiContent;
          planData.abouttheplace = aiContent.abouttheplace || planData.abouttheplace;
          planData.besttimetovisit = aiContent.besttimetovisit;
          planData.topplacestovisit = aiContent.topplacestovisit || [];
          planData.itinerary = aiContent.itinerary || [];
          planData.adventuresactivitiestodo = aiContent.adventuresactivitiestodo || [];
          planData.localcuisinerecommendations = aiContent.localcuisinerecommendations || [];
          planData.packingchecklist = aiContent.packingchecklist || [];
        } else {
          console.error('AI generation failed:', aiContent?.error);
          planData.ai_error = aiContent?.error || 'AI generation failed';
        }
      } catch (aiError) {
        console.error('Error generating AI content:', aiError);
        planData.ai_error = 'AI generation failed';
      }
    }

    const result = await db.collection('plans').insertOne(planData);
    const createdPlan = await db.collection('plans').findOne({ _id: result.insertedId });

    res.status(201).json({ 
      success: true,
      message: generateWithAI ? 'AI-powered plan created successfully!' : 'Plan created successfully',
      plan: {
        ...createdPlan,
        id: createdPlan._id.toString()
      }
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create plan',
      error: error.message 
    });
  }
});

// PUT: Update a plan
router.put('/:planId', [
  param('planId').isMongoId().withMessage('Invalid plan ID'),
  body('nameoftheplace').optional().notEmpty().withMessage('Plan name cannot be empty'),
  body('abouttheplace').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const userId = req.user.id;
    const updateData = { ...req.body, updated_at: new Date() };
    const db = getDb();

    const result = await db.collection('plans').updateOne(
      { _id: new ObjectId(planId), user_id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const updatedPlan = await db.collection('plans').findOne({ _id: new ObjectId(planId) });
    res.json({ 
      success: true,
      message: 'Plan updated successfully',
      plan: updatedPlan 
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// DELETE: Delete a plan
router.delete('/:planId', [
  param('planId').isMongoId().withMessage('Invalid plan ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.params;
    const userId = req.user.id;
    const db = getDb();

    const result = await db.collection('plans').deleteOne({
      _id: new ObjectId(planId),
      user_id: userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ 
      success: true,
      message: 'Plan deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
