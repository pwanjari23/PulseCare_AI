const { validationResult, matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Handles Patient registration HTTP requests
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const registerPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    // Only extract validated and sanitized fields (safeguarding against unexpected parameters)
    const validatedData = matchedData(req, { includeOptionals: true });
    
    // Inject connection audit headers
    validatedData.ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    validatedData.userAgent = req.headers['user-agent'] || 'Unknown';

    const userDto = await authService.registerPatient(validatedData);

    return res.status(201).json(
      new ApiResponse(201, userDto, 'Patient registration completed successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles Doctor registration HTTP requests (sets status to pending verification)
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const registerDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    // Only extract validated and sanitized fields
    const validatedData = matchedData(req, { includeOptionals: true });

    // Inject connection audit headers
    validatedData.ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    validatedData.userAgent = req.headers['user-agent'] || 'Unknown';

    const userDto = await authService.registerDoctor(validatedData);

    return res.status(201).json(
      new ApiResponse(
        201,
        userDto,
        'Doctor registration submitted successfully. Your credentials are pending administrative approval and verification.'
      )
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerPatient,
  registerDoctor
};
