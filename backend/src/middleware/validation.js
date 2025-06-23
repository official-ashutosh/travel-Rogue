// Simplified validation middleware for starting phase
// Most validations removed to reduce overhead

// Minimal validation - just pass through
const noValidation = (req, res, next) => {
  next();
};

// Export all validation functions as no-op for compatibility
module.exports = {
  validateRegister: noValidation,
  validateLogin: noValidation,
  validateCreatePlan: noValidation,
  validateCreateExpense: noValidation,
  validateCreateFeedback: noValidation,
  validateCreateInvite: noValidation,
  handleValidationErrors: noValidation
};
