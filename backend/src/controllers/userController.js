const { User, Plan, Access } = require('../models');
const { createResponse, paginate } = require('../utils/helpers');
const { Op } = require('sequelize');

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    
    res.json(
      createResponse('success', 'Profile retrieved successfully', { user })
    );
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.userId;

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    await user.update({ firstName, lastName });

    res.json(
      createResponse('success', 'Profile updated successfully', { user })
    );
  } catch (error) {
    next(error);
  }
};

// Get user credits
const getCredits = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ 
      where: { userId },
      attributes: ['credits', 'freeCredits']
    });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    res.json(
      createResponse('success', 'Credits retrieved successfully', {
        credits: user.credits,
        freeCredits: user.freeCredits,
        totalCredits: user.credits + user.freeCredits
      })
    );
  } catch (error) {
    next(error);
  }
};

// Reduce user credits by one
const reduceCredits = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    // Check if user has credits
    if (user.freeCredits === 0 && user.credits === 0) {
      return res.status(400).json(
        createResponse('error', 'Insufficient credits')
      );
    }

    // Use free credits first
    if (user.freeCredits > 0) {
      user.freeCredits -= 1;
    } else {
      user.credits -= 1;
    }

    await user.save();

    res.json(
      createResponse('success', 'Credit deducted successfully', {
        credits: user.credits,
        freeCredits: user.freeCredits,
        totalCredits: user.credits + user.freeCredits
      })
    );
  } catch (error) {
    next(error);
  }
};

// Add credits to user (admin only or after payment)
const addCredits = async (req, res, next) => {
  try {
    const { credits } = req.body;
    const { userId } = req.params;

    if (!credits || credits <= 0) {
      return res.status(400).json(
        createResponse('error', 'Invalid credit amount')
      );
    }

    const user = await User.findOne({ 
      where: { userId },
      attributes: { include: ['credits'] }
    });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    await user.increment('credits', { by: credits });

    // Reload user to get updated values
    await user.reload();

    res.json(
      createResponse('success', `${credits} credits added successfully`, {
        credits: user.credits,
        freeCredits: user.freeCredits,
        totalCredits: user.credits + user.freeCredits
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password', 'passwordResetToken'] },
      offset: skip,
      limit: limitNum,
      order: [['createdAt', 'DESC']]
    });

    const total = await User.count({ where: whereClause });

    res.json(
      createResponse('success', 'Users retrieved successfully', {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limitNum),
          totalUsers: total,
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Deactivate user account
const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    await user.update({ isActive: false });

    res.json(
      createResponse('success', 'Account deactivated successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Delete user account (soft delete)
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Instead of actual deletion, we'll deactivate and anonymize
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    await user.update({
      isActive: false,
      email: `deleted_${Date.now()}@deleted.com`,
      firstName: 'Deleted',
      lastName: 'User'
    });

    res.json(
      createResponse('success', 'Account deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Admin function to update user status
const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'suspended', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(
        createResponse('error', 'Invalid status. Must be one of: active, suspended, inactive')
      );
    }

    const user = await User.findByPk(userId, { 
      attributes: { exclude: ['password'] } 
    });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    await user.update({ status });

    res.json(
      createResponse('success', `User status updated to ${status}`, {
        user
      })
    );
  } catch (error) {
    next(error);
  }
};

// Admin function to delete user
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    // Delete user's data
    await Promise.all([
      Plan.destroy({ where: { userId: user.userId } }),
      Access.destroy({ where: { userId: user.userId } }),
      user.destroy()
    ]);

    res.json(
      createResponse('success', 'User deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getCredits,
  reduceCredits,
  addCredits,
  getAllUsers,
  deactivateAccount,
  deleteAccount,
  // Admin functions
  updateUserStatus,
  deleteUser
};
