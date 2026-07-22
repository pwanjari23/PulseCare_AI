const { validationResult, matchedData } = require('express-validator');
const doctorService = require('../services/doctor.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Retrieves the authenticated doctor's complete profile.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await doctorService.getDoctorProfile(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Doctor profile retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates the authenticated doctor's profile.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const updateMyProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const profile = await doctorService.updateDoctorProfile(req.user.id, validatedData, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, profile, 'Doctor profile updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves safe public profile info for a doctor.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await doctorService.getPublicDoctorProfile(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Public doctor profile retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves the complete profile of a doctor for administrative tasks.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getProfileForAdmin = async (req, res, next) => {
  try {
    const profile = await doctorService.getDoctorProfileForAdmin(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Complete doctor profile retrieved successfully for administrative review.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves all doctors list.
 */
const getDoctors = async (req, res, next) => {
  try {
    const list = await doctorService.getDoctors();
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctors retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  getProfileForAdmin,
  getDoctors
};
