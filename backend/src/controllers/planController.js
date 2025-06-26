const { Op } = require('sequelize');
const { Plan, User, Access, PlanSettings } = require('../models');
const { createResponse, paginate } = require('../utils/helpers');
const { generateCompletePlanWithGemini } = require('../services/geminiService');
const { generateWeatherDataForPlan } = require('../services/weatherService');

// Enhanced plan creation with comprehensive data collection
const createPlan = async (req, res, next) => {
  try {
    const { 
      nameoftheplace,
      userPrompt,
      isGeneratedUsingAI = false,
      startDate,
      endDate,
      numberOfDays,
      budgetRange,
      travelStyle,
      groupSize,
      interests,
      accommodationType,
      transportPreference
    } = req.body;
    const userId = req.userId;

    console.log('Creating plan for user:', userId);
    console.log('Plan data:', { nameoftheplace, isGeneratedUsingAI, startDate, endDate });

    // Validate required fields
    if (!nameoftheplace) {
      return res.status(400).json(
        createResponse('error', 'Destination is required')
      );
    }

    if (!userId) {
      return res.status(401).json(
        createResponse('error', 'User authentication required')
      );
    }

    // Check if user exists and has credits for AI generation
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    if (isGeneratedUsingAI && user.freeCredits === 0 && user.credits === 0) {
      return res.status(400).json(
        createResponse('error', 'Insufficient credits for AI generation. Please purchase credits or create a manual plan.')
      );
    }

    // Prepare plan data with safe defaults
    const planData = {
      nameoftheplace: nameoftheplace.trim(),
      userPrompt: userPrompt || `I want to visit ${nameoftheplace}`,
      userId,
      isGeneratedUsingAI,
      abouttheplace: '',
      adventuresactivitiestodo: [],
      topplacestovisit: [],
      packingchecklist: [],
      localcuisinerecommendations: [],
      besttimetovisit: '',
      itinerary: {},
      contentGenerationState: {
        imagination: false,
        abouttheplace: false,
        adventuresactivitiestodo: false,
        topplacestovisit: false,
        itinerary: false,
        localcuisinerecommendations: false,
        packingchecklist: false,
        besttimetovisit: false
      },
      views: 0,
      likes: 0,
      rating: null,
      budget: null,
      tags: interests || [],
      travelers: groupSize || 1,
      groupSize: groupSize || 1,
      isPublic: false,
      weatherData: null
    };

    // Set dates if provided
    if (startDate) {
      try {
        planData.startDate = new Date(startDate);
      } catch (dateError) {
        return res.status(400).json(
          createResponse('error', 'Invalid start date format')
        );
      }
    }
    
    if (endDate) {
      try {
        planData.endDate = new Date(endDate);
      } catch (dateError) {
        return res.status(400).json(
          createResponse('error', 'Invalid end date format')
        );
      }
    }

    // If AI generation is requested, generate complete plan data
    if (isGeneratedUsingAI) {
      try {
        console.log('Starting AI generation for plan...');
        
        // Check if Gemini API key is available
        if (!process.env.GEMINI_API_KEY) {
          return res.status(500).json(
            createResponse('error', 'AI service is not available. Please create a manual plan.')
          );
        }

        const aiGeneratedData = await generateCompletePlanWithGemini({
          nameoftheplace,
          userPrompt: userPrompt || `I want to visit ${nameoftheplace}`,
          startDate,
          endDate,
          numberOfDays,
          budgetRange,
          travelStyle,
          groupSize,
          interests,
          accommodationType,
          transportPreference
        });

        // Merge AI generated data with the plan
        Object.assign(planData, aiGeneratedData);
        
        // Generate weather data for AI-created plans (non-blocking)
        try {
          console.log('Generating weather data for AI plan...');
          const weatherData = await generateWeatherDataForPlan(nameoftheplace);
          planData.weatherData = weatherData;
          console.log('Weather data generated successfully for AI plan:', {
            hasCurrentWeather: !!weatherData.current,
            hasForecast: !!weatherData.forecast,
            hasSeasonal: !!weatherData.seasonal
          });
        } catch (weatherError) {
          console.warn('Weather generation failed:', weatherError.message);
          // Continue without weather data if API fails
        }
        
        // Update content generation state to show all content is generated
        planData.contentGenerationState = {
          imagination: true,
          abouttheplace: true,
          adventuresactivitiestodo: true,
          topplacestovisit: true,
          itinerary: true,
          localcuisinerecommendations: true,
          packingchecklist: true,
          besttimetovisit: true
        };
        
        console.log('AI generation completed successfully');

      } catch (aiError) {
        console.error('AI Generation Error:', aiError);
        return res.status(500).json(
          createResponse('error', `AI generation failed: ${aiError.message}. Please try creating a manual plan.`)
        );
      }
    } else {
      // For manual plans, still generate weather data if possible
      try {
        console.log('Generating weather data for manual plan...');
        const weatherData = await generateWeatherDataForPlan(nameoftheplace);
        planData.weatherData = weatherData;
        console.log('Weather data generated successfully for manual plan:', {
          hasCurrentWeather: !!weatherData.current,
          hasForecast: !!weatherData.forecast,
          hasSeasonal: !!weatherData.seasonal
        });
      } catch (weatherError) {
        console.warn('Weather generation failed for manual plan:', weatherError.message);
        // Continue without weather data if API fails
      }
    }

    console.log('Creating plan in database...');
    console.log('Plan data summary:', {
      destination: planData.nameoftheplace,
      hasWeatherData: !!planData.weatherData,
      isAI: planData.isGeneratedUsingAI,
      userId: planData.userId
    });

    // Create the plan
    const savedPlan = await Plan.create(planData);
    
    console.log('Plan created with ID:', savedPlan.id);
    console.log('Saved plan weather data:', !!savedPlan.weatherData);

    // Deduct credits only after successful plan creation
    if (isGeneratedUsingAI) {
      try {
        if (user.freeCredits > 0) {
          await user.update({ 
            freeCredits: user.freeCredits - 1 
          });
        } else {
          await user.update({ 
            credits: user.credits - 1 
          });
        }
        console.log('Credits deducted successfully');
      } catch (creditError) {
        console.error('Error deducting credits:', creditError);
        // Don't fail the request if credit deduction fails
      }
    }

    // Create default plan settings
    try {
      await PlanSettings.create({
        userId,
        planId: savedPlan.id,
        currencyCode: 'USD',
        isPublished: false
      });
      console.log('Plan settings created successfully');
    } catch (settingsError) {
      console.error('Error creating plan settings:', settingsError);
      // Don't fail the request if settings creation fails
    }

    res.status(201).json(
      createResponse('success', 'Plan created successfully', { plan: savedPlan })
    );

  } catch (error) {
    console.error('Error creating plan:', error);
    console.error('Stack trace:', error.stack);
    
    // More specific error messages
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json(
        createResponse('error', `Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      );
    }
    
    if (error.name === 'SequelizeConnectionError') {
      return res.status(500).json(
        createResponse('error', 'Database connection error. Please try again later.')
      );
    }
    
    res.status(500).json(
      createResponse('error', 'An unexpected error occurred while creating the plan. Please try again.')
    );
  }
};

// Get user's plans
const getUserPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Get user's own plans
    const ownPlans = await Plan.findAll({
      where: { userId },
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']]
    });

    // Get shared plans
    const accessRecords = await Access.findAll({ 
      where: { userId },
      include: [{ model: Plan, as: 'plan' }]
    });
    const sharedPlans = accessRecords.map(record => record.plan).filter(Boolean);

    const totalOwn = await Plan.count({ where: { userId } });
    const totalShared = sharedPlans.length;

    // Set cache control headers to prevent caching of user plans
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json(
      createResponse('success', 'Plans retrieved successfully', {
        ownPlans,
        sharedPlans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOwn / limitNum),
          totalOwnPlans: totalOwn,
          totalSharedPlans: totalShared,
          hasNext: skip + limitNum < totalOwn,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get single plan
const getPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check access permissions
    let hasAccess = false;
    let userRole = 'viewer';

    if (plan.userId === userId) {
      hasAccess = true;
      userRole = 'admin';
    } else {
      const access = await Access.findOne({ where: { planId, userId } });
      if (access) {
        hasAccess = true;
        userRole = access.role;
      } else if (plan.isPublic) {
        hasAccess = true;
        userRole = 'viewer';
      }
    }

    if (!hasAccess) {
      return res.status(403).json(
        createResponse('error', 'Access denied')
      );
    }

    // Get plan settings
    const planSettings = await PlanSettings.findOne({ where: { planId } });

    // Set cache control headers to prevent caching of plan data
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json(
      createResponse('success', 'Plan retrieved successfully', {
        plan,
        planSettings,
        userRole,
        hasAccess
      })
    );
  } catch (error) {
    next(error);
  }
};

// Update plan
const updatePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check if user is plan owner
    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Only plan owner can update the plan')
      );
    }

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;
    delete updates.updatedAt;

    await plan.update(updates);
    await plan.reload();

    res.json(
      createResponse('success', 'Plan updated successfully', { plan })
    );
  } catch (error) {
    next(error);
  }
};

// Delete plan
const deletePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check if user is plan owner
    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Only plan owner can delete the plan')
      );
    }

    // Delete associated records
    await Promise.all([
      plan.destroy(),
      Access.destroy({ where: { planId } }),
      PlanSettings.destroy({ where: { planId } })
    ]);

    res.json(
      createResponse('success', 'Plan deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Get public/community plans
const getPublicPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, companion } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let whereClause = { isPublic: true };

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { nameoftheplace: { [Op.iLike]: `%${search}%` } },
        { userPrompt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get plan IDs that match companion filter
    if (companion) {
      const settings = await PlanSettings.findAll({
        where: {
          companion: { [Op.iLike]: `%${companion}%` },
          isPublished: true
        },
        attributes: ['planId']
      });
      const planIds = settings.map(s => s.planId);
      if (planIds.length > 0) {
        whereClause.id = { [Op.in]: planIds };
      }
    }

    const plans = await Plan.findAll({
      where: whereClause,
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']]
    });

    const total = await Plan.count({ where: whereClause });

    res.json(
      createResponse('success', 'Public plans retrieved successfully', {
        plans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalPlans: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Toggle plan visibility (public/private)
const togglePlanVisibility = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check if user is plan owner
    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Only plan owner can change visibility')
      );
    }

    // Toggle visibility
    plan.isPublic = !plan.isPublic;
    await plan.save();

    // Update plan settings
    await PlanSettings.update(
      { isPublished: plan.isPublic },
      { where: { planId } }
    );

    res.json(
      createResponse('success', `Plan is now ${plan.isPublic ? 'public' : 'private'}`, {
        isPublic: plan.isPublic
      })
    );
  } catch (error) {
    next(error);  }
};

// Admin functions
const getAllPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { nameoftheplace: { [Op.iLike]: `%${search}%` } },
          { abouttheplace: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const plans = await Plan.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }],
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']]
    });

    const total = await Plan.count({ where: whereClause });

    res.json(
      createResponse('success', 'Plans retrieved successfully', {
        plans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalPlans: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

const updatePlanStatus = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'published', 'rejected', 'featured'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(
        createResponse('error', 'Invalid status. Must be one of: pending, published, rejected, featured')
      );
    }

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    plan.status = status;
    if (status === 'published' || status === 'featured') {
      plan.isPublic = true;
    }
    await plan.save();

    res.json(
      createResponse('success', `Plan status updated to ${status}`, {
        plan
      })
    );
  } catch (error) {
    next(error);
  }
};

const deletePlanAdmin = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Delete associated data
    await Access.destroy({ where: { planId } });
    await PlanSettings.destroy({ where: { planId } });
    await plan.destroy();

    res.json(
      createResponse('success', 'Plan deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlan,
  getUserPlans,
  getPlan,
  updatePlan,
  deletePlan,
  getPublicPlans,
  togglePlanVisibility,
  // Admin functions
  getAllPlans,
  updatePlanStatus,
  deletePlanAdmin
};
