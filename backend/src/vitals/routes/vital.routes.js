const { Router } = require('express');
const vitalController = require('../controllers/vital.controller');
const { vitalRules } = require('../validators/vital.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Patient logs a new vital sign record
 * POST /api/v1/vitals
 */
router.post('/', authenticate, authorize('Patient'), vitalRules, vitalController.recordVital);

/**
 * Patient retrieves their own history of logged vitals
 * GET /api/v1/vitals/me
 */
router.get('/me', authenticate, authorize('Patient'), vitalController.getPatientVitals);

/**
 * Patient retrieves their most recently logged vital signs record
 * GET /api/v1/vitals/latest
 */
router.get('/latest', authenticate, authorize('Patient'), vitalController.getLatestVital);

/**
 * Patient updates their logged vital signs record by ID
 * PUT /api/v1/vitals/:id
 */
router.put('/:id', authenticate, authorize('Patient'), vitalRules, vitalController.updateVital);

/**
 * Patient deletes their logged vital signs record by ID
 * DELETE /api/v1/vitals/:id
 */
router.delete('/:id', authenticate, authorize('Patient'), vitalController.deleteVital);

/**
 * Doctor or Admin retrieves vital logs of a target patient ID
 * GET /api/v1/vitals/patient/:id
 */
router.get('/patient/:id', authenticate, authorize('Doctor', 'Admin'), vitalController.getPatientVitalsByAdminOrDoctor);

module.exports = router;
