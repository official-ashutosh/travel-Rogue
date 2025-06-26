const { Feedback, Plan, User } = require('../models');
const { createResponse, paginate } = require('../utils/helpers');
const { sendFeedbackAcknowledgmentEmail } = require('../services/emailService');
const { Op } = require('sequelize');

// Create feedback
const createFeedback = async (req, res, next) => {
  try {
    const { 
      message, 
      comment,
      label, 
      planId, 
      rating = 5,
      category = 'general' 
    } = req.body;
    const userId = req.userId;

    // If planId is provided, check if plan exists
    if (planId) {
      const plan = await Plan.findByPk(planId);
      if (!plan) {
        return res.status(404).json(
          createResponse('error', 'Plan not found')
        );
      }
    }

    const feedback = await Feedback.create({
      userId,
      planId: planId || null,
      message: message || comment || '',
      comment: comment || message || '',
      label: label || 'other',
      category,
      rating,
      status: 'open',
      priority: 'medium',
      isPublic: true
    });

    // Send acknowledgment email (async, don't wait for it)
    const user = req.user;
    if (user && user.email && user.firstName) {
      sendFeedbackAcknowledgmentEmail(user.email, user.firstName, label)
        .catch(err => console.error('Failed to send feedback acknowledgment email:', err));
    }

    res.status(201).json(
      createResponse('success', 'Feedback submitted successfully', { feedback })
    );
  } catch (error) {
    next(error);
  }
};

// Get user's feedback
const getUserFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, label } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Build query
    let query = { userId };
    if (status) query.status = status;
    if (label) query.label = label;

    const feedback = await Feedback.findAll({
      where: query,
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']],
      include: [{ model: Plan, as: 'plan', attributes: ['nameoftheplace'] }]
    });

    const total = await Feedback.count({ where: query });

    res.json(
      createResponse('success', 'Feedback retrieved successfully', {
        feedback,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalFeedback: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get all feedback (admin only)
const getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, label, priority, search } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Build query
    const { Op } = require('sequelize');
    let query = {};
    if (status) query.status = status;
    if (label) query.label = label;
    if (priority) query.priority = priority;

    if (search) {
      query[Op.or] = [
        { message: { [Op.iLike]: `%${search}%` } },
        { userId: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const feedback = await Feedback.findAll({
      where: query,
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']],
      include: [{ model: Plan, as: 'plan', attributes: ['nameoftheplace'] }]
    });

    const total = await Feedback.count({ where: query });

    // Get feedback statistics using Sequelize
    const [openCount, inProgressCount, resolvedCount, closedCount] = await Promise.all([
      Feedback.count({ where: { status: 'open' } }),
      Feedback.count({ where: { status: 'in_progress' } }),
      Feedback.count({ where: { status: 'resolved' } }),
      Feedback.count({ where: { status: 'closed' } })
    ]);

    const stats = {
      totalFeedback: total,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount
    };

    res.json(
      createResponse('success', 'All feedback retrieved successfully', {
        feedback,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalFeedback: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Update feedback (admin only)
const updateFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { status, priority, adminResponse, adminUserId } = req.body;

    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json(
        createResponse('error', 'Feedback not found')
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.adminUserId = adminUserId;
      updateData.responseDate = new Date();
    }

    await feedback.update(updateData);

    // Re-fetch with associations
    const updatedFeedback = await Feedback.findByPk(feedbackId, {
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['nameoftheplace']
        },
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    res.json(
      createResponse('success', 'Feedback updated successfully', { feedback: updatedFeedback })
    );
  } catch (error) {
    next(error);
  }
};

// Delete feedback
const deleteFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.userId;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json(
        createResponse('error', 'Feedback not found')
      );
    }

    // Only allow user to delete their own feedback or admin
    if (feedback.userId !== userId) {
      // Check if user is admin (you would implement admin check here)
      return res.status(403).json(
        createResponse('error', 'Access denied. You can only delete your own feedback.')
      );
    }

    await Feedback.findByIdAndDelete(feedbackId);

    res.json(
      createResponse('success', 'Feedback deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Get feedback by plan
const getPlanFeedback = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Check if plan exists and user has access
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Only plan owner can see feedback for their plan
    if (plan.userId !== userId) {
      return res.status(403).json(
        createResponse('error', 'Access denied')
      );
    }

    const feedback = await Feedback.find({ planId })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    const total = await Feedback.count({ where: { planId } });

    res.json(
      createResponse('success', 'Plan feedback retrieved successfully', {
        feedback,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalFeedback: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
  getPlanFeedback
};
