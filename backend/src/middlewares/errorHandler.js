const { ApiError } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errors, stack } = err;

  // If error is not an instance of custom ApiError, standardize it as a 500 error
  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
    errors = err.errors || [];
  }

  const response = {
    success: false,
    message,
    errors,
    data: null,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Log error via winston logger
  logger.error(`[${req.method}] ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);
  
  if (process.env.NODE_ENV === 'development' && err.stack) {
    logger.error(err.stack);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
