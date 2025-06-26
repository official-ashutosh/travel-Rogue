const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PlanSettings = sequelize.define('PlanSettings', {
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
    allowNull: false,
    references: {
      model: 'plans',
      key: 'id'
    }
  },
  currencyCode: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  activityPreferences: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  fromDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  toDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  companion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  accommodationType: {
    type: DataTypes.ENUM('hotel', 'hostel', 'airbnb', 'resort', 'other'),
    allowNull: true
  },
  transportMode: {
    type: DataTypes.ENUM('flight', 'train', 'bus', 'car', 'bike', 'other'),
    allowNull: true
  }
}, {
  tableName: 'plan_settings',
  timestamps: true
});

module.exports = PlanSettings;
