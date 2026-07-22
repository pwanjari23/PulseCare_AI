const { validationResult, matchedData } = require('express-validator');
const patientService = require('../services/patient.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Retrieves the authenticated patient's complete profile.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await patientService.getMyProfile(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Patient profile retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates the authenticated patient's profile details.
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

    const profile = await patientService.updateMyProfile(req.user.id, validatedData, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, profile, 'Patient profile updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves a doctor-safe patient details for authorized doctors.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getPatientForDoctor = async (req, res, next) => {
  try {
    const profile = await patientService.getPatientForDoctor(req.params.id, req.user.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Patient clinical profile retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves the complete profile of a patient for administrators.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next handler
 */
const getPatientForAdmin = async (req, res, next) => {
  try {
    const profile = await patientService.getPatientForAdmin(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, profile, 'Complete patient profile retrieved successfully for administrative review.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves list of patients for Doctors and Admins.
 */
const getPatients = async (req, res, next) => {
  try {
    const list = await patientService.getPatients(req.user);
    return res.status(200).json(
      new ApiResponse(200, list, 'Patients retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPatientForDoctor,
  getPatientForAdmin,
  getPatients
};
