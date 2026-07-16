const { Router } = require('express');
const doctorController = require('../controllers/doctor.controller');
const { updateProfileRules } = require('../validators/doctor.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Retrieve doctor's own profile
 * GET /api/v1/doctors/me
 */
router.get('/me', authenticate, authorize('Doctor'), doctorController.getMyProfile);

/**
 * Update doctor's own profile
 * PUT /api/v1/doctors/me
 */
router.put('/me', authenticate, authorize('Doctor'), updateProfileRules, doctorController.updateMyProfile);

/**
 * Public profile endpoint for patients
 * GET /api/v1/doctors/:id
 */
router.get('/:id', doctorController.getPublicProfile);

module.exports = router;
