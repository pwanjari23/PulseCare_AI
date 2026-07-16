const { Router } = require('express');
const healthSummaryController = require('../controllers/health-summary.controller');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * GET /api/v1/health-summary/me
 * Patient only access to their own health summary.
 */
router.get(
  '/me',
  authenticate,
  authorize('Patient'),
  healthSummaryController.getMySummary
);

/**
 * GET /api/v1/health-summary/patient/:patientId
 * Doctor and Admin access to patient summaries.
 */
router.get(
  '/patient/:patientId',
  authenticate,
  authorize('Doctor', 'Admin'),
  healthSummaryController.getPatientSummary
);

module.exports = router;
