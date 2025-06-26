const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Access = sequelize.define('Access', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plans',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('viewer', 'editor', 'admin'),
    defaultValue: 'viewer'
  },
  grantedBy: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'accesses',
  timestamps: true
});

module.exports = Access;
