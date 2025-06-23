const Plan = require('../models/Plan');
const User = require('../models/User');

// Get all public community plans
const getCommunityPlans = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, destination } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { nameoftheplace: { $regex: search, $options: 'i' } },
        { abouttheplace: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (destination) {
      query.nameoftheplace = { $regex: destination, $options: 'i' };
    }
    
    // Get plans with pagination
    const plans = await Plan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName')
      .lean();
    
    // Get total count for pagination
    const totalPlans = await Plan.countDocuments(query);
    
    res.json({
      status: 'success',
      data: {
        plans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPlans / limit),
          totalPlans,
          hasNextPage: totalPlans > page * limit,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Community plans fetch error:', error);
    res.status(500).json({
      status: 'error', 
      message: 'Failed to fetch community plans'
    });
  }
};

// Get a specific public plan by ID
const getCommunityPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await Plan.findOne({ _id: planId, isPublic: true })
      .populate('userId', 'firstName lastName email')
      .lean();
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Community plan not found'
      });
    }
    
    // Increment view count
    await Plan.findByIdAndUpdate(planId, { $inc: { views: 1 } });
    
    res.json({
      status: 'success',
      data: plan
    });
  } catch (error) {
    console.error('Community plan fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch community plan'
    });
  }
};

// Like/Unlike a community plan
const togglePlanLike = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.userId;
    
    // Check if plan exists and is public
    const plan = await Plan.findOne({ _id: planId, isPublic: true });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Community plan not found'
      });
    }
    
    // Check if user already liked this plan
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    const hasLiked = user.likedPlans && user.likedPlans.includes(planId);
    
    if (hasLiked) {
      // Unlike the plan
      await User.findOneAndUpdate(
        { userId },
        { $pull: { likedPlans: planId } }
      );
      await Plan.findByIdAndUpdate(planId, { $inc: { likes: -1 } });
      
      res.json({
        status: 'success',
        message: 'Plan unliked successfully',
        liked: false
      });
    } else {
      // Like the plan
      await User.findOneAndUpdate(
        { userId },
        { $addToSet: { likedPlans: planId } }
      );
      await Plan.findByIdAndUpdate(planId, { $inc: { likes: 1 } });
      
      res.json({
        status: 'success',
        message: 'Plan liked successfully',
        liked: true
      });
    }
  } catch (error) {
    console.error('Plan like/unlike error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to like/unlike plan'
    });
  }
};

// Get popular community plans
const getPopularPlans = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const plans = await Plan.find({ isPublic: true })
      .sort({ 
        likes: -1, 
        views: -1, 
        createdAt: -1 
      })
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName')
      .lean();
    
    res.json({
      status: 'success',
      data: plans
    });
  } catch (error) {
    console.error('Popular plans fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch popular plans'
    });
  }
};

module.exports = {
  getCommunityPlans,
  getCommunityPlan,
  togglePlanLike,
  getPopularPlans
};
