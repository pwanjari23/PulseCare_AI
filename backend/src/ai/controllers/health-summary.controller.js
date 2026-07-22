const healthSummaryService = require('../services/health-summary.service');
const { Patient } = require('#models/index.js');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * GET /health-summary/me — Retrieve health summary for patient or doctor.
 */
const getMySummary = async (req, res, next) => {
  try {
    let targetPatientId = req.user.id;

    if (req.user.role !== 'Patient') {
      const pId = req.query.patientId || req.query.patient_id;
      if (pId) {
        targetPatientId = parseInt(pId, 10);
      } else {
        const firstPatient = await Patient.findOne();
        if (firstPatient) {
          targetPatientId = firstPatient.id;
        }
      }
    }

    const dto = await healthSummaryService.getPatientSummary(req.user.id, req.user.role, targetPatientId);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Health summary retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /health-summary/patient/:patientId — Doctor or Admin retrieves a patient's summary.
 */
const getPatientSummary = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId, 10);
    if (isNaN(patientId) || patientId <= 0) {
      throw new ApiError(400, 'Patient ID must be a positive integer.');
    }

    const dto = await healthSummaryService.getPatientSummary(req.user.id, req.user.role, patientId);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Patient health summary retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /health-summary/generate — Trigger fresh AI analysis
 */
const generateSummary = async (req, res, next) => {
  try {
    let targetPatientId = req.body.patientId || req.user.id;
    if (req.user.role !== 'Patient' && !req.body.patientId) {
      const firstPatient = await Patient.findOne();
      if (firstPatient) targetPatientId = firstPatient.id;
    }

    const dto = await healthSummaryService.getPatientSummary(req.user.id, req.user.role, targetPatientId);
    return res.status(200).json(
      new ApiResponse(200, dto, 'AI health summary generated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMySummary,
  getPatientSummary,
  generateSummary
};
