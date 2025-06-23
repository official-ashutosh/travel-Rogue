const { generateCompletePlanWithGemini } = require('../services/geminiService');
const Plan = require('../models/Plan');
const User = require('../models/User');

// Generate AI travel plan
const generateAIPlan = async (req, res) => {
  try {
    const {
      nameoftheplace,
      userPrompt,
      startDate,
      endDate,
      numberOfDays,
      budgetRange,
      travelStyle,
      interests,
      companion,
      accommodationType,
      transportPreference
    } = req.body;

    // Validate required fields
    if (!nameoftheplace || !userPrompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination and user prompt are required'
      });
    }

    // Check if user has credits
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.credits <= 0 && user.freeCredits <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient credits to generate AI plan'
      });
    }

    const userInput = {
      nameoftheplace,
      userPrompt,
      startDate,
      endDate,
      numberOfDays: numberOfDays || 3,
      budgetRange,
      travelStyle,
      interests: interests || [],
      companion,
      accommodationType,
      transportPreference,
      userId: req.user.userId
    };

    // Generate AI plan
    const aiPlan = await generateCompletePlanWithGemini(userInput);

    // Deduct credits
    if (user.freeCredits > 0) {
      user.freeCredits -= 1;
    } else {
      user.credits -= 1;
    }
    await user.save();

    res.json({
      status: 'success',
      data: {
        plan: aiPlan,
        creditsRemaining: user.credits,
        freeCreditsRemaining: user.freeCredits
      }
    });
  } catch (error) {
    console.error('AI plan generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate AI travel plan'
    });
  }
};

// Get AI suggestions for destinations
const getDestinationSuggestions = async (req, res) => {
  try {
    const { preferences, budget, season } = req.body;

    // For now, return curated suggestions based on preferences
    // This could be enhanced with AI in the future
    const allSuggestions = [
      {
        destination: 'Paris, France',
        reason: 'Perfect for romantic getaways and cultural experiences',
        bestFor: ['culture', 'romance', 'history'],
        budget: 'medium-high',
        season: ['spring', 'fall']
      },
      {
        destination: 'Tokyo, Japan',
        reason: 'Great mix of traditional and modern culture',
        bestFor: ['culture', 'food', 'technology'],
        budget: 'medium-high',
        season: ['spring', 'fall']
      },
      {
        destination: 'Bali, Indonesia',
        reason: 'Ideal for relaxation and adventure',
        bestFor: ['relaxation', 'adventure', 'nature'],
        budget: 'low-medium',
        season: ['summer', 'winter']
      },
      {
        destination: 'Rome, Italy',
        reason: 'Rich history and amazing cuisine',
        bestFor: ['history', 'culture', 'food'],
        budget: 'medium',
        season: ['spring', 'fall']
      },
      {
        destination: 'New York, USA',
        reason: 'Urban adventure and cultural diversity',
        bestFor: ['urban', 'culture', 'shopping'],
        budget: 'high',
        season: ['spring', 'summer', 'fall']
      },
      {
        destination: 'Dubai, UAE',
        reason: 'Luxury and modern attractions',
        bestFor: ['luxury', 'shopping', 'modern'],
        budget: 'high',
        season: ['winter', 'spring']
      }
    ];

    // Filter suggestions based on preferences
    let filteredSuggestions = allSuggestions;

    if (preferences && preferences.length > 0) {
      filteredSuggestions = allSuggestions.filter(suggestion =>
        suggestion.bestFor.some(category => 
          preferences.includes(category)
        )
      );
    }

    if (budget) {
      filteredSuggestions = filteredSuggestions.filter(suggestion =>
        suggestion.budget.includes(budget)
      );
    }

    if (season) {
      filteredSuggestions = filteredSuggestions.filter(suggestion =>
        suggestion.season.includes(season)
      );
    }

    // Limit to top 6 suggestions
    const suggestions = filteredSuggestions.slice(0, 6);

    res.json({
      status: 'success',
      data: { suggestions }
    });
  } catch (error) {
    console.error('Destination suggestion error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get destination suggestions'
    });
  }
};

module.exports = {
  generateAIPlan,
  getDestinationSuggestions
};
