const Expense = require('../models/Expense');
const Plan = require('../models/Plan');
const Access = require('../models/Access');
const { createResponse, paginate, calculateExpenseTotals } = require('../utils/helpers');

// Create expense
const createExpense = async (req, res, next) => {
  try {
    const { planId, amount, purpose, category, date, currency = 'USD', notes } = req.body;
    const userId = req.userId;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    // Check if user has access to plan
    let hasAccess = false;
    if (plan.userId === userId) {
      hasAccess = true;
    } else {
      const access = await Access.findOne({ planId, userId });
      if (access && ['editor', 'admin'].includes(access.role)) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json(
        createResponse('error', 'Access denied. You cannot add expenses to this plan.')
      );
    }

    const expense = await Expense.create({
      planId,
      userId,
      amount,
      purpose,
      category,
      date,
      currency,
      notes
    });

    res.status(201).json(
      createResponse('success', 'Expense created successfully', { expense })
    );
  } catch (error) {
    next(error);
  }
};

// Get expenses for a plan
const getPlanExpenses = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { page = 1, limit = 50, category, startDate, endDate } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Check if plan exists and user has access
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    let hasAccess = false;
    if (plan.userId === userId) {
      hasAccess = true;
    } else {
      const access = await Access.findOne({ planId, userId });
      if (access) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json(
        createResponse('error', 'Access denied')
      );
    }

    // Build query
    let query = { planId };
    
    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Get expenses
    const expenses = await Expense.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ date: -1, createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    const total = await Expense.countDocuments(query);

    // Calculate totals
    const allExpenses = await Expense.find({ planId });
    const totals = calculateExpenseTotals(allExpenses);

    res.json(
      createResponse('success', 'Expenses retrieved successfully', {
        expenses,
        totals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalExpenses: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get user's expenses across all plans
const getUserExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;
    const userId = req.userId;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Build query
    let query = { userId };
    
    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const expenses = await Expense.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ date: -1, createdAt: -1 })
      .populate('planId', 'nameoftheplace');

    const total = await Expense.countDocuments(query);

    // Calculate totals for user
    const allUserExpenses = await Expense.find({ userId });
    const totals = calculateExpenseTotals(allUserExpenses);

    res.json(
      createResponse('success', 'User expenses retrieved successfully', {
        expenses,
        totals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalExpenses: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Update expense
const updateExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const { amount, purpose, category, date, currency, notes } = req.body;
    const userId = req.userId;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json(
        createResponse('error', 'Expense not found')
      );
    }

    // Check if user owns the expense or has admin access to the plan
    let canEdit = false;
    if (expense.userId === userId) {
      canEdit = true;
    } else {
      const plan = await Plan.findById(expense.planId);
      if (plan && plan.userId === userId) {
        canEdit = true;
      } else {
        const access = await Access.findOne({ 
          planId: expense.planId, 
          userId,
          role: { $in: ['admin', 'editor'] }
        });
        if (access) {
          canEdit = true;
        }
      }
    }

    if (!canEdit) {
      return res.status(403).json(
        createResponse('error', 'Access denied. You cannot edit this expense.')
      );
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { amount, purpose, category, date, currency, notes },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    res.json(
      createResponse('success', 'Expense updated successfully', { expense: updatedExpense })
    );
  } catch (error) {
    next(error);
  }
};

// Delete expense
const deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const userId = req.userId;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json(
        createResponse('error', 'Expense not found')
      );
    }

    // Check if user owns the expense or has admin access to the plan
    let canDelete = false;
    if (expense.userId === userId) {
      canDelete = true;
    } else {
      const plan = await Plan.findById(expense.planId);
      if (plan && plan.userId === userId) {
        canDelete = true;
      } else {
        const access = await Access.findOne({ 
          planId: expense.planId, 
          userId,
          role: { $in: ['admin', 'editor'] }
        });
        if (access) {
          canDelete = true;
        }
      }
    }

    if (!canDelete) {
      return res.status(403).json(
        createResponse('error', 'Access denied. You cannot delete this expense.')
      );
    }

    await Expense.findByIdAndDelete(expenseId);

    res.json(
      createResponse('success', 'Expense deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Get expense analytics for a plan
const getExpenseAnalytics = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.userId;

    // Check if plan exists and user has access
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json(
        createResponse('error', 'Plan not found')
      );
    }

    let hasAccess = false;
    if (plan.userId === userId) {
      hasAccess = true;
    } else {
      const access = await Access.findOne({ planId, userId });
      if (access) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return res.status(403).json(
        createResponse('error', 'Access denied')
      );
    }

    // Get all expenses for the plan
    const expenses = await Expense.find({ planId });

    // Calculate analytics
    const totals = calculateExpenseTotals(expenses);
    
    // Daily breakdown
    const dailyBreakdown = expenses.reduce((acc, expense) => {
      const date = expense.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += expense.amount;
      return acc;
    }, {});

    // Category distribution
    const categoryDistribution = {
      food: 0,
      commute: 0,
      shopping: 0,
      gifts: 0,
      accomodations: 0,
      others: 0
    };

    expenses.forEach(expense => {
      categoryDistribution[expense.category] += expense.amount;
    });

    // Top expenses
    const topExpenses = expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    res.json(
      createResponse('success', 'Expense analytics retrieved successfully', {
        totals,
        dailyBreakdown,
        categoryDistribution,
        topExpenses,
        totalTransactions: expenses.length
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getPlanExpenses,
  getUserExpenses,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics
};
