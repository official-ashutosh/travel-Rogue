// Enhanced validation for plan creation with comprehensive user input

const validatePlanCreationInput = (req, res, next) => {
  const {
    nameoftheplace,
    userPrompt,
    startDate,
    endDate,
    numberOfDays,
    budgetRange,
    travelStyle,
    groupSize,
    interests,
    accommodationType,
    transportPreference
  } = req.body;

  // Basic validation
  if (!nameoftheplace || nameoftheplace.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Destination name is required'
    });
  }

  if (!userPrompt || userPrompt.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a detailed description of your travel preferences (at least 10 characters)'
    });
  }

  // Validate dates if provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }
  }

  // Validate number of days
  if (numberOfDays && (numberOfDays < 1 || numberOfDays > 365)) {
    return res.status(400).json({
      success: false,
      message: 'Number of days must be between 1 and 365'
    });
  }

  // Validate group size
  if (groupSize && (groupSize < 1 || groupSize > 50)) {
    return res.status(400).json({
      success: false,
      message: 'Group size must be between 1 and 50'
    });
  }

  next();
};

module.exports = {
  validatePlanCreationInput
};
