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
    const validatedData = matchedData(req, { includeOptionals: true });
    
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
    const validatedData = matchedData(req, { includeOptionals: true });

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

/**
 * Handles user login requests, authenticates credentials, and issues session tokens
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req);

    validatedData.ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    validatedData.userAgent = req.headers['user-agent'] || 'Unknown';

    const authResultDto = await authService.loginUser(validatedData);

    return res.status(200).json(
      new ApiResponse(200, authResultDto, 'Login completed successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles Token Refresh HTTP requests
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const refreshToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const { refreshToken } = req.body; // Transport layer extraction (could be req.cookies.refreshToken in the future)
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const resultDto = await authService.refreshAccessToken(refreshToken, { ipAddress, userAgent });

    return res.status(200).json(
      new ApiResponse(200, resultDto, 'Access token refreshed successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Handles User Logout HTTP requests
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware handler
 */
const logout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const { refreshToken } = req.body; // Transport layer extraction (could be req.cookies.refreshToken in the future)
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await authService.logoutUser(refreshToken, { ipAddress, userAgent });

    return res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  refreshToken,
  logout
};
