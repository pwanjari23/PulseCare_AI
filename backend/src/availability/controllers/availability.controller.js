const { validationResult, matchedData } = require('express-validator');
const availabilityService = require('../services/availability.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Creates availability block (Doctor only).
 */
const createAvailability = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const record = await availabilityService.createAvailability(req.user.id, validatedData, { ipAddress, userAgent });
    return res.status(201).json(
      new ApiResponse(201, record, 'Doctor availability slot created successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates availability block (Doctor only).
 */
const updateAvailability = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const recordId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const record = await availabilityService.updateAvailability(req.user.id, recordId, validatedData, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, record, 'Doctor availability slot updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Disables availability block (Doctor only).
 */
const disableAvailability = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const record = await availabilityService.disableAvailability(req.user.id, recordId, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, record, 'Doctor availability slot disabled successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Soft deletes availability block (Doctor only).
 */
const deleteAvailability = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await availabilityService.deleteAvailability(req.user.id, recordId, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, null, 'Doctor availability slot deleted successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves availability schedule for the authenticated doctor (Doctor only).
 */
const getMyAvailability = async (req, res, next) => {
  try {
    const list = await availabilityService.getMyAvailability(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctor schedule retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Public search for doctor's availability (Patients, Doctors, and Admins).
 */
const getDoctorAvailability = async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    const list = await availabilityService.getDoctorAvailability(doctorId);
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctor public availability retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAvailability,
  updateAvailability,
  disableAvailability,
  deleteAvailability,
  getMyAvailability,
  getDoctorAvailability
};
