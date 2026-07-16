const { validationResult, matchedData } = require('express-validator');
const service = require('../services/password-reset.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

const forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req);
    const result = await service.forgotPassword(validatedData.email);
    return res.status(200).json(
      new ApiResponse(200, result, 'Password reset request processed.')
    );
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req);
    const result = await service.resetPassword(validatedData.token, validatedData.newPassword);
    return res.status(200).json(
      new ApiResponse(200, result, 'Password has been reset successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
