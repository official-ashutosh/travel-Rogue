const User = require('../models/User');
const { createResponse, paginate } = require('../utils/helpers');

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

    const user = await User.findOneAndUpdate(
      { userId },
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

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

    const user = await User.findOne({ userId }, 'credits freeCredits');
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

    const user = await User.findOneAndUpdate(
      { userId },
      { $inc: { credits: credits } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

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

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password -passwordResetToken')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

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

    const user = await User.findOneAndUpdate(
      { userId },
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

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
    const user = await User.findOneAndUpdate(
      { userId },
      {
        isActive: false,
        email: `deleted_${Date.now()}@deleted.com`,
        firstName: 'Deleted',
        lastName: 'User'
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    res.json(
      createResponse('success', 'Account deleted successfully')
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
  deleteAccount
};
