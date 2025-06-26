const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nameoftheplace: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userPrompt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  isGeneratedUsingAI: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Content fields
  abouttheplace: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adventuresactivitiestodo: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  topplacestovisit: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  itinerary: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  localcuisinerecommendations: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  packingchecklist: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  besttimetovisit: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Content generation tracking
  contentGenerationState: {
    type: DataTypes.JSONB,
    defaultValue: {
      imagination: false,
      abouttheplace: false,
      adventuresactivitiestodo: false,
      topplacestovisit: false,
      itinerary: false,
      localcuisinerecommendations: false,
      packingchecklist: false,
      besttimetovisit: false
    }
  },
  // Plan metadata
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  // Date fields (unified)
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  // Traveler info
  travelers: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  groupSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Budget info
  budget: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  totalBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  // Weather data
  weatherData: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Other fields
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'plans',
  timestamps: true
});

module.exports = Plan;
