const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'plans',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  label: {
    type: DataTypes.ENUM('issue', 'idea', 'question', 'complaint', 'featurerequest', 'other'),
    defaultValue: 'other'
  },
  category: {
    type: DataTypes.ENUM('general', 'plan', 'feature', 'bug'),
    defaultValue: 'general'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed', 'pending', 'reviewed'),
    defaultValue: 'open'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminUserId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'feedbacks',
  timestamps: true
});

module.exports = Feedback;
