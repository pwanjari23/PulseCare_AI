const { validationResult, matchedData } = require('express-validator');
const vitalService = require('../services/vital.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Records a new vital signs entry (Patient only).
 */
const recordVital = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const vital = await vitalService.recordVital(req.user.id, validatedData, { ipAddress, userAgent });
    return res.status(201).json(
      new ApiResponse(201, vital, 'Vital signs recorded successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Updates an existing vital signs entry (Patient only).
 */
const updateVital = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const recordId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const vital = await vitalService.updateVital(req.user.id, recordId, validatedData, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, vital, 'Vital signs updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Deletes a vital signs entry (Patient only).
 */
const deleteVital = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await vitalService.deleteVital(req.user.id, recordId, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, null, 'Vital signs record deleted successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves the patient's own history of vital records.
 */
const getPatientVitals = async (req, res, next) => {
  try {
    const list = await vitalService.getPatientVitals(req.user.id, req.user.role, req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Vitals history retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves the latest recorded vital signs for the authenticated patient.
 */
const getLatestVital = async (req, res, next) => {
  try {
    const vital = await vitalService.getLatestVital(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, vital, 'Latest vital record retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor or Admin retrieves vital logs of a target patient.
 */
const getPatientVitalsByAdminOrDoctor = async (req, res, next) => {
  try {
    const targetPatientId = req.params.id;
    const list = await vitalService.getPatientVitals(req.user.id, req.user.role, targetPatientId);
    return res.status(200).json(
      new ApiResponse(200, list, 'Vitals history retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  recordVital,
  updateVital,
  deleteVital,
  getPatientVitals,
  getLatestVital,
  getPatientVitalsByAdminOrDoctor
};
