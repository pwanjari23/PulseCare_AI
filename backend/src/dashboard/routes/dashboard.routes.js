const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * GET /api/v1/dashboard/patient
 * Access restricted to Patient role.
 */
router.get(
  '/patient',
  authenticate,
  authorize('Patient'),
  dashboardController.getPatientDashboard
);

/**
 * GET /api/v1/dashboard/doctor
 * Access restricted to Doctor role.
 */
router.get(
  '/doctor',
  authenticate,
  authorize('Doctor'),
  dashboardController.getDoctorDashboard
);

/**
 * GET /api/v1/dashboard/admin
 * Access restricted to Admin role.
 */
router.get(
  '/admin',
  authenticate,
  authorize('Admin'),
  dashboardController.getAdminDashboard
);

module.exports = router;
