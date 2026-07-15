const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiResponse');

/**
 * Middleware to validate express-validator results and throw centralized ApiError if invalid
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  // Trigger centralized error handler with validation failure info
  throw new ApiError(400, 'Validation failed', formattedErrors);
};

module.exports = validate;
