const { Op } = require('sequelize');
const { User, Plan, Expense, Payment, Feedback } = require('../models');
const { createResponse } = require('../utils/helpers');

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get user's statistics
    const [
      userPlansCount,
      userExpensesCount,
      userPaymentsCount,
      userFeedbackCount,
      totalExpensesAmount,
      recentPlans,
      recentExpenses
    ] = await Promise.all([
      Plan.count({ where: { userId } }),
      Expense.count({ where: { userId } }),
      Payment.count({ where: { userId, status: 'completed' } }),
      Feedback.count({ where: { userId } }),
      Expense.sum('amount', { where: { userId } }),
      Plan.findAll({ 
        where: { userId }, 
        order: [['createdAt', 'DESC']], 
        limit: 5,
        attributes: ['nameoftheplace', 'createdAt', 'isPublic']
      }),
      Expense.findAll({ 
        where: { userId }, 
        order: [['createdAt', 'DESC']], 
        limit: 5,
        include: [{ model: Plan, as: 'plan', attributes: ['nameoftheplace'] }]
      })
    ]);

    const stats = {
      totalPlans: userPlansCount,
      totalExpenses: userExpensesCount,
      totalPayments: userPaymentsCount,
      totalFeedback: userFeedbackCount,
      totalExpensesAmount: totalExpensesAmount || 0,
      recentPlans,
      recentExpenses
    };

    res.json(
      createResponse('success', 'Dashboard statistics retrieved successfully', { stats })
    );
  } catch (error) {
    next(error);
  }
};

// Get admin dashboard statistics (admin only)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPlans,
      totalExpenses,
      totalPayments,
      totalRevenue,
      activeUsers,
      publicPlans,
      pendingFeedback
    ] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Plan.count(),
      Expense.count(),
      Payment.count({ where: { status: 'completed' } }),
      Payment.sum('amount', { where: { status: 'completed' } }),
      User.count({ 
        where: { 
          lastLogin: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      }),
      Plan.count({ where: { isPublic: true } }),
      Feedback.count({ where: { status: 'open' } })
    ]);

    // For now, let's simplify user growth calculation
    const userGrowth = [];
    const revenueGrowth = [];

    const stats = {
      overview: {
        totalUsers,
        totalPlans,
        totalExpenses,
        totalPayments,
        totalRevenue: totalRevenue || 0,
        activeUsers,
        publicPlans,
        pendingFeedback
      },
      growth: {
        userGrowth,
        revenueGrowth
      }
    };

    res.json(
      createResponse('success', 'Admin dashboard statistics retrieved successfully', { stats })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminDashboardStats
};
