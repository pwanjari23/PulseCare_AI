const { Router } = require('express');
const doctorNoteController = require('../controllers/doctor-note.controller');
const {
  createNoteRules,
  updateNoteRules,
  noteIdRules
} = require('../validators/doctor-note.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * GET /api/v1/doctor-notes/me
 * Doctor retrieves all notes they have created (excluding archived).
 */
router.get('/me', authenticate, authorize('Doctor'), doctorNoteController.getDoctorNotes);

/**
 * GET /api/v1/doctor-notes/admin/patient/:patientId
 * Admin lists all notes of a specific patient.
 */
router.get(
  '/admin/patient/:patientId',
  authenticate,
  authorize('Admin'),
  doctorNoteController.getPatientNotesForAdmin
);

/**
 * POST /api/v1/doctor-notes
 * Doctor creates a new note.
 */
router.post(
  '/',
  authenticate,
  authorize('Doctor'),
  createNoteRules,
  doctorNoteController.createNote
);

/**
 * PUT /api/v1/doctor-notes/:id
 * Doctor updates a note.
 */
router.put(
  '/:id',
  authenticate,
  authorize('Doctor'),
  updateNoteRules,
  doctorNoteController.updateNote
);

/**
 * PATCH /api/v1/doctor-notes/:id/archive
 * Doctor archives a note.
 */
router.patch(
  '/:id/archive',
  authenticate,
  authorize('Doctor'),
  noteIdRules,
  doctorNoteController.archiveNote
);

/**
 * GET /api/v1/doctor-notes/:id
 * Doctor (own) or Admin retrieves a note.
 */
router.get(
  '/:id',
  authenticate,
  authorize('Doctor', 'Admin'),
  noteIdRules,
  doctorNoteController.getNote
);

module.exports = router;
