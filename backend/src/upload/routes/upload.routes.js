/**
 * PulseCare AI – Upload Routes
 *
 * POST  /upload/profile-image    → Authenticated (any role)
 * POST  /upload/doctor-document  → Doctor only
 * POST  /upload/prescription     → Doctor only
 * POST  /upload/medical-report   → Patient only
 * POST  /upload/lab-report       → Patient only
 * GET   /upload/my-files         → Authenticated (own files, optional ?category= filter)
 * GET   /upload/:uuid            → Owner or Admin
 * DELETE /upload/:uuid           → Owner or Admin
 */

const { Router } = require('express');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');
const { upload, handleMulterError } = require('../config/multer');
const { validateUpload } = require('../validators/upload.validator');
const controller = require('../controllers/upload.controller');

const router = Router();

/** All upload routes require authentication */
router.use(authenticate);

// ─── Upload Endpoints ─────────────────────────────────────────────────────────

router.post(
  '/profile-image',
  upload.single('file'),
  handleMulterError,
  validateUpload('PROFILE_IMAGE'),
  controller.uploadProfileImage
);

router.post(
  '/doctor-document',
  authorize('Doctor'),
  upload.single('file'),
  handleMulterError,
  validateUpload('DOCTOR_DOCUMENT'),
  controller.uploadDoctorDocument
);

router.post(
  '/prescription',
  authorize('Doctor'),
  upload.single('file'),
  handleMulterError,
  validateUpload('PRESCRIPTION'),
  controller.uploadPrescription
);

router.post(
  '/medical-report',
  authorize('Patient'),
  upload.single('file'),
  handleMulterError,
  validateUpload('MEDICAL_REPORT'),
  controller.uploadMedicalReport
);

router.post(
  '/lab-report',
  authorize('Patient'),
  upload.single('file'),
  handleMulterError,
  validateUpload('LAB_REPORT'),
  controller.uploadLabReport
);

// ─── Retrieval Endpoints ──────────────────────────────────────────────────────

/** Must appear BEFORE /:uuid to avoid param hijacking */
router.get('/my-files', controller.getMyFiles);

router.get('/:uuid', controller.getFile);

// ─── Delete Endpoint ──────────────────────────────────────────────────────────

router.delete('/:uuid', controller.deleteFile);

module.exports = router;
