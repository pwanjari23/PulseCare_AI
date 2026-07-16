const { Router } = require('express');
const availabilityController = require('../controllers/availability.controller');
const { availabilityRules } = require('../validators/availability.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Doctor creates availability schedule block
 * POST /api/v1/availability
 */
router.post('/', authenticate, authorize('Doctor'), availabilityRules, availabilityController.createAvailability);

/**
 * Doctor retrieves their own schedule blocks
 * GET /api/v1/availability/me
 */
router.get('/me', authenticate, authorize('Doctor'), availabilityController.getMyAvailability);

/**
 * Doctor updates an availability schedule block
 * PUT /api/v1/availability/:id
 */
router.put('/:id', authenticate, authorize('Doctor'), availabilityRules, availabilityController.updateAvailability);

/**
 * Doctor disables an availability schedule block
 * PATCH /api/v1/availability/:id/disable
 */
router.patch('/:id/disable', authenticate, authorize('Doctor'), availabilityController.disableAvailability);

/**
 * Doctor deletes an availability schedule block
 * DELETE /api/v1/availability/:id
 */
router.delete('/:id', authenticate, authorize('Doctor'), availabilityController.deleteAvailability);

/**
 * Patient retrieves public availability blocks for a doctor
 * GET /api/v1/availability/doctor/:doctorId
 */
router.get('/doctor/:doctorId', authenticate, availabilityController.getDoctorAvailability);

module.exports = router;
