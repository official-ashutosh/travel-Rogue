const { sequelize } = require('../config/database');
const User = require('./User');
const Plan = require('./Plan');
const Access = require('./Access');
const Expense = require('./Expense');
const Feedback = require('./Feedback');
const Invite = require('./Invite');
const Payment = require('./Payment');
const PlanSettings = require('./PlanSettings');

// Define associations
Plan.hasMany(Access, { foreignKey: 'planId', as: 'accesses' });
Access.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

Plan.hasMany(Expense, { foreignKey: 'planId', as: 'expenses' });
Expense.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

// User associations for expenses
User.hasMany(Expense, { foreignKey: 'userId', sourceKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId', as: 'user' });

Plan.hasMany(Feedback, { foreignKey: 'planId', as: 'feedbacks' });
Feedback.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

Plan.hasMany(Invite, { foreignKey: 'planId', as: 'invites' });
Invite.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

Plan.hasMany(PlanSettings, { foreignKey: 'planId', as: 'settings' });
PlanSettings.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

// User associations for community features
User.hasMany(Plan, { foreignKey: 'userId', sourceKey: 'userId', as: 'plans' });
Plan.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Plan,
  Access,
  Expense,
  Feedback,
  Invite,
  Payment,
  PlanSettings
};
