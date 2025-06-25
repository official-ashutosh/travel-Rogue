const Plan = require('../models/Plan');
const Access = require('../models/Access');
const PlanSettings = require('../models/PlanSettings');
const User = require('../models/User');
const { createResponse, paginate } = require('../utils/helpers');
const { generateCompletePlanWithGemini } = require('../services/geminiService');

// Enhanced plan creation with comprehensive data collection
const createPlan = async (req, res, next) => {
  try {
    const { 
      nameoftheplace,
      userPrompt,
      isGeneratedUsingAI = true,
      // New fields for better AI generation
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

    // Validate required fields
    if (!nameoftheplace || !userPrompt) {
      return res.status(400).json(
        createResponse('error', 'Place name and user prompt are required')
      );
    }

    // Check if user has credits for AI generation
    if (isGeneratedUsingAI) {
      const user = await User.findOne({ userId });
      if (user.freeCredits === 0 && user.credits === 0) {
        return res.status(400).json(
          createResponse('error', 'Insufficient credits for AI generation')
        );
      }
    }

    // Create initial plan
    const newPlan = new Plan({
      nameoftheplace,
      userPrompt,
      userId,
      isGeneratedUsingAI,
      contentGenerationState: {
        imagination: false,
        abouttheplace: false,
        adventuresactivitiestodo: false,
        topplacestovisit: false,
        itinerary: false,
        localcuisinerecommendations: false,
        packingchecklist: false,
        besttimetovisit: false
      }
    });

    // If AI generation is requested, generate complete plan data
    if (isGeneratedUsingAI && process.env.GEMINI_API_KEY) {
      try {
        const aiGeneratedData = await generateCompletePlanWithGemini({
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
        });

        // Merge AI generated data with the plan
        Object.assign(newPlan, aiGeneratedData);
        
        // Ensure schema consistency - add default values for UI consistency
        newPlan.views = newPlan.views || 0;
        newPlan.likes = newPlan.likes || 0;
        newPlan.rating = newPlan.rating || null;
        newPlan.budget = newPlan.budget || null;
        newPlan.tags = newPlan.tags || [];
        newPlan.travelers = newPlan.travelers || groupSize || null;
        
        // Set dates if provided
        if (startDate) newPlan.fromdate = new Date(startDate);
        if (endDate) newPlan.todate = new Date(endDate);
        
        // Update content generation state to show all content is generated
        newPlan.contentGenerationState = {
          imagination: true,
          abouttheplace: true,
          adventuresactivitiestodo: true,
          topplacestovisit: true,
          itinerary: true,
          localcuisinerecommendations: true,
          packingchecklist: true,
          besttimetovisit: true
        };
        
        // Reduce user credits for AI generation
        await User.findOneAndUpdate(
          { userId },
          { $inc: { freeCredits: -1 } }
        );

      } catch (aiError) {
        console.error('AI Generation Error:', aiError);
        // Continue with basic plan creation even if AI fails
      }
    }

    const savedPlan = await newPlan.save();

    // Create default plan settings
    await PlanSettings.create({
      userId,
      planId: savedPlan._id,
      currencyCode: 'USD',
      isPublished: false
    });

    res.status(201).json(
      createResponse('success', 'Plan created successfully', { plan: savedPlan })
    );
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json(
      createResponse('error', 'Error creating plan', { error: error.message })
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
    const ownPlans = await Plan.find({ userId })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName');

    // Get shared plans
    const accessRecords = await Access.find({ userId }).populate('planId');
    const sharedPlans = accessRecords.map(record => record.planId).filter(Boolean);

    const totalOwn = await Plan.countDocuments({ userId });
    const totalShared = sharedPlans.length;

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

    const plan = await Plan.findById(planId);
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
      const access = await Access.findOne({ planId, userId });
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
    const planSettings = await PlanSettings.findOne({ planId });

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

    const plan = await Plan.findById(planId);
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
    delete updates._id;
    delete updates.userId;
    delete updates.createdAt;
    delete updates.updatedAt;

    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      updates,
      { new: true, runValidators: true }
    );

    res.json(
      createResponse('success', 'Plan updated successfully', { plan: updatedPlan })
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

    const plan = await Plan.findById(planId);
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
      Plan.findByIdAndDelete(planId),
      Access.deleteMany({ planId }),
      PlanSettings.deleteOne({ planId })
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

    let query = { isPublic: true };

    // Add search filter
    if (search) {
      query.$or = [
        { nameoftheplace: { $regex: search, $options: 'i' } },
        { userPrompt: { $regex: search, $options: 'i' } }
      ];
    }

    // Get plan IDs that match companion filter
    let planIds = [];
    if (companion) {
      const settings = await PlanSettings.find({
        companion: { $regex: companion, $options: 'i' },
        isPublished: true
      }).select('planId');
      planIds = settings.map(s => s.planId);
      query._id = { $in: planIds };
    }

    const plans = await Plan.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName');

    const total = await Plan.countDocuments(query);

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

    const plan = await Plan.findById(planId);
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
    await PlanSettings.findOneAndUpdate(
      { planId },
      { isPublished: plan.isPublic }
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

    let query = {};
    if (search) {
      query = {
        $or: [
          { nameoftheplace: { $regex: search, $options: 'i' } },
          { abouttheplace: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const plans = await Plan.find(query)
      .populate('userId', 'firstName lastName email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Plan.countDocuments(query);

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

    const plan = await Plan.findById(planId);
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

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Delete associated data
    await Access.deleteMany({ planId });
    await PlanSettings.deleteMany({ planId });
    await Plan.findByIdAndDelete(planId);

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
