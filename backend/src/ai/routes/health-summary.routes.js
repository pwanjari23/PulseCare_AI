const { Router } = require('express');
const healthSummaryController = require('../controllers/health-summary.controller');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * GET /api/v1/health-summary/me
 */
router.get(
  '/me',
  authenticate,
  authorize('Patient', 'Doctor', 'Admin'),
  healthSummaryController.getMySummary
);

/**
 * GET /api/v1/health-summary/patient/:patientId
 */
router.get(
  '/patient/:patientId',
  authenticate,
  authorize('Doctor', 'Admin'),
  healthSummaryController.getPatientSummary
);

/**
 * POST /api/v1/health-summary/generate
 */
router.post(
  '/generate',
  authenticate,
  authorize('Patient', 'Doctor', 'Admin'),
  healthSummaryController.generateSummary
);

/**
 * GET /api/v1/health-summary
 */
router.get(
  '/',
  authenticate,
  authorize('Patient', 'Doctor', 'Admin'),
  healthSummaryController.getMySummary
);

module.exports = router;
