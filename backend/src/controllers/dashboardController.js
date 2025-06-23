const User = require('../models/User');
const Plan = require('../models/Plan');
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const Feedback = require('../models/Feedback');
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
      Plan.countDocuments({ userId }),
      Expense.countDocuments({ userId }),
      Payment.countDocuments({ userId, status: 'completed' }),
      Feedback.countDocuments({ userId }),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Plan.find({ userId }).sort({ createdAt: -1 }).limit(5).select('nameoftheplace createdAt isPublic'),
      Expense.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('planId', 'nameoftheplace')
    ]);

    const stats = {
      totalPlans: userPlansCount,
      totalExpenses: userExpensesCount,
      totalPayments: userPaymentsCount,
      totalFeedback: userFeedbackCount,
      totalExpensesAmount: totalExpensesAmount[0]?.total || 0,
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
      User.countDocuments({ isActive: true }),
      Plan.countDocuments(),
      Expense.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.countDocuments({ 
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }),
      Plan.countDocuments({ isPublic: true }),
      Feedback.countDocuments({ status: 'open' })
    ]);

    // User growth over last 12 months
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Revenue over last 12 months
    const revenueGrowth = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalPlans,
        totalExpenses,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
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
