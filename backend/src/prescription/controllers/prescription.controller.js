const { validationResult, matchedData } = require('express-validator');
const prescriptionService = require('../services/prescription.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * POST /prescriptions — Doctor creates a new prescription.
 */
const createPrescription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed.', errors.array()));
  }

  try {
    const data = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const dto = await prescriptionService.createPrescription(req.user.id, data, { ipAddress, userAgent });
    return res.status(201).json(
      new ApiResponse(201, dto, 'Prescription created successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /prescriptions/:id — Doctor updates their prescription.
 */
const updatePrescription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed.', errors.array()));
  }

  try {
    const { id, ...data } = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const dto = await prescriptionService.updatePrescription(req.user.id, id, data, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, dto, 'Prescription updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /prescriptions/:id — Role-based single prescription retrieval.
 */
const getPrescription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed.', errors.array()));
  }

  try {
    const prescriptionId = parseInt(req.params.id, 10);
    const dto = await prescriptionService.getPrescription(req.user.id, req.user.role, prescriptionId);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Prescription retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /prescriptions/me — Doctor retrieves their own prescriptions.
 */
const getDoctorPrescriptions = async (req, res, next) => {
  try {
    const list = await prescriptionService.getDoctorPrescriptions(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctor prescriptions retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /prescriptions/patient — Patient retrieves their own prescriptions.
 */
const getPatientPrescriptions = async (req, res, next) => {
  try {
    const list = await prescriptionService.getPatientPrescriptions(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Patient prescriptions retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPrescription,
  updatePrescription,
  getPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions
};
