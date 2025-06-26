const { User } = require('../models');

const adminOnly = async (req, res, next) => {
  try {
    // Check if user is authenticated (this should come after auth middleware)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Get user from database to check role
    const user = await User.findOne({ where: { userId: req.user.userId } });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    // User is admin, continue to next middleware/route
    req.admin = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = adminOnly;
