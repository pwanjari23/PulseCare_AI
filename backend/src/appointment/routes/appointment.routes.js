const { Router } = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { bookAppointmentRules, completeAppointmentRules } = require('../validators/appointment.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Patient books a new appointment
 * POST /api/v1/appointments
 */
router.post('/', authenticate, authorize('Patient'), bookAppointmentRules, appointmentController.bookAppointment);

/**
 * Patient retrieves their own bookings list
 * GET /api/v1/appointments/me
 */
router.get('/me', authenticate, authorize('Patient'), appointmentController.getPatientAppointments);

/**
 * Doctor retrieves their own calendar list
 * GET /api/v1/appointments/doctor
 */
router.get('/doctor', authenticate, authorize('Doctor'), appointmentController.getDoctorAppointments);

/**
 * Patient, Doctor, or Admin cancels an appointment
 * PATCH /api/v1/appointments/:id/cancel
 */
router.patch('/:id/cancel', authenticate, appointmentController.cancelAppointment);

/**
 * Doctor marks an appointment Completed and optionally adds notes
 * PATCH /api/v1/appointments/:id/complete
 */
router.patch('/:id/complete', authenticate, authorize('Doctor'), completeAppointmentRules, appointmentController.completeAppointment);

/**
 * Patient, Doctor, or Admin retrieves appointment details
 * GET /api/v1/appointments/:id
 */
router.get('/:id', authenticate, appointmentController.getAppointment);

module.exports = router;
