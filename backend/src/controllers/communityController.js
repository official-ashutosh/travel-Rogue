const { Op } = require('sequelize');
const { Plan, User } = require('../models');

// Get all public community plans
const getCommunityPlans = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, destination } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const { Op } = require('sequelize');
    let query = { isPublic: true };
    
    if (search) {
      query[Op.or] = [
        { nameoftheplace: { [Op.iLike]: `%${search}%` } },
        { abouttheplace: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (destination) {
      query.nameoftheplace = { [Op.iLike]: `%${destination}%` };
    }
    
    // Get plans with pagination
    const plans = await Plan.findAll({
      where: query,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: parseInt(limit)
    });
    
    // Get total count for pagination
    const totalPlans = await Plan.count({ where: query });
    
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
    
    const plan = await Plan.findOne({ 
      where: { id: planId, isPublic: true },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }]
    });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Community plan not found'
      });
    }
    
    // Increment view count
    await Plan.increment('views', { where: { id: planId } });
    
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
    const plan = await Plan.findOne({ 
      where: { id: planId, isPublic: true } 
    });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Community plan not found'
      });
    }
    
    // Check if user already liked this plan
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    const hasLiked = user.likedPlans && user.likedPlans.includes(planId);
    
    if (hasLiked) {
      // Unlike the plan
      const updatedLikedPlans = user.likedPlans.filter(id => id !== planId);
      await user.update({ likedPlans: updatedLikedPlans });
      await Plan.decrement('likes', { where: { id: planId } });
      
      res.json({
        status: 'success',
        message: 'Plan unliked successfully',
        liked: false
      });
    } else {
      // Like the plan
      const updatedLikedPlans = [...(user.likedPlans || []), planId];
      await user.update({ likedPlans: updatedLikedPlans });
      await Plan.increment('likes', { where: { id: planId } });
      
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
    
    const plans = await Plan.findAll({
      where: { isPublic: true },
      order: [
        ['likes', 'DESC'], 
        ['views', 'DESC'], 
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
    });
    
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
