const { Router } = require('express');
const patientController = require('../controllers/patient.controller');
const { updatePatientRules } = require('../validators/patient.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Retrieve patient's own complete profile
 * GET /api/v1/patients/me
 */
router.get('/me', authenticate, authorize('Patient'), patientController.getMyProfile);

/**
 * Update patient's own profile
 * PUT /api/v1/patients/me
 */
router.put('/me', authenticate, authorize('Patient'), updatePatientRules, patientController.updateMyProfile);

/**
 * Retrieve patient clinical info for authorized doctors
 * GET /api/v1/patients/doctor/:id
 */
router.get('/doctor/:id', authenticate, authorize('Doctor'), patientController.getPatientForDoctor);

/**
 * Retrieve complete patient profile for administrators
 * GET /api/v1/patients/admin/:id
 */
router.get('/admin/:id', authenticate, authorize('Admin'), patientController.getPatientForAdmin);

/**
 * Retrieve all patients (Admin / Doctor list view)
 * GET /api/v1/patients
 */
router.get('/', authenticate, authorize('Doctor', 'Admin'), patientController.getPatients);

module.exports = router;
