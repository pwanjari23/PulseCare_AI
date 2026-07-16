const { Router } = require('express');
const prescriptionController = require('../controllers/prescription.controller');
const {
  createPrescriptionRules,
  updatePrescriptionRules,
  prescriptionIdRules
} = require('../validators/prescription.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * GET /api/v1/prescriptions/me
 * Doctor retrieves all prescriptions they have issued.
 * Must be defined before /:id to avoid route ambiguity.
 */
router.get('/me', authenticate, authorize('Doctor'), prescriptionController.getDoctorPrescriptions);

/**
 * GET /api/v1/prescriptions/patient
 * Patient retrieves their own prescriptions.
 * Must be defined before /:id to avoid route ambiguity.
 */
router.get('/patient', authenticate, authorize('Patient'), prescriptionController.getPatientPrescriptions);

/**
 * POST /api/v1/prescriptions
 * Doctor creates a new prescription.
 */
router.post('/', authenticate, authorize('Doctor'), createPrescriptionRules, prescriptionController.createPrescription);

/**
 * PUT /api/v1/prescriptions/:id
 * Doctor updates their own prescription (replaces medicine list).
 */
router.put('/:id', authenticate, authorize('Doctor'), updatePrescriptionRules, prescriptionController.updatePrescription);

/**
 * GET /api/v1/prescriptions/:id
 * Role-based access: Doctor (own), Patient (own), Admin (any).
 */
router.get('/:id', authenticate, authorize('Doctor', 'Patient', 'Admin'), prescriptionIdRules, prescriptionController.getPrescription);

module.exports = router;
