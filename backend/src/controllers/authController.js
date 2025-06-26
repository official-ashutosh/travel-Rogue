const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, createResponse } = require('../utils/helpers');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

// Register user
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(
        createResponse('error', 'User already exists with this email')
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique userId
    const userId = crypto.randomUUID();

    // Create user
    const user = await User.create({
      userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      credits: 0,
      freeCredits: 2
    });

    // Generate token
    const token = generateToken(user.userId);

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(email, firstName).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    res.status(201).json(
      createResponse('success', 'User registered successfully', {
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          credits: user.credits,
          freeCredits: user.freeCredits,
          role: user.role
        },
        token
      })
    );
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (include password for validation)
    const user = await User.scope('withPassword').findOne({ 
      where: { email }
    });
    if (!user) {
      return res.status(401).json(
        createResponse('error', 'Invalid email or password')
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json(
        createResponse('error', 'Account has been deactivated')
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json(
        createResponse('error', 'Invalid email or password')
      );
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user.userId);

    res.json(
      createResponse('success', 'Login successful', {
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          credits: user.credits,
          freeCredits: user.freeCredits,
          lastLogin: user.lastLogin,
          role: user.role
        },
        token
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get current user
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    
    res.json(
      createResponse('success', 'User retrieved successfully', {
        user: {
          id: user.id,
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          credits: user.credits,
          freeCredits: user.freeCredits,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          role: user.role
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Request password reset
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found with this email')
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await user.update({
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken, user.firstName);
      
      res.json(
        createResponse('success', 'Password reset email sent')
      );
    } catch (emailError) {
      await user.update({
        passwordResetToken: null,
        passwordResetExpires: null
      });
      
      return res.status(500).json(
        createResponse('error', 'Failed to send password reset email')
      );
    }
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json(
        createResponse('error', 'Invalid or expired reset token')
      );
    }

    // Set new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    // Generate new token
    const authToken = generateToken(user.userId);

    res.json(
      createResponse('success', 'Password reset successful', {
        token: authToken
      })
    );
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Get user with password
    const user = await User.findOne({ 
      where: { userId },
      attributes: { include: ['password'] }
    });
    if (!user) {
      return res.status(404).json(
        createResponse('error', 'User not found')
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json(
        createResponse('error', 'Current password is incorrect')
      );
    }

    // Set new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashedPassword });

    res.json(
      createResponse('success', 'Password changed successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  requestPasswordReset,
  resetPassword,
  changePassword
};
