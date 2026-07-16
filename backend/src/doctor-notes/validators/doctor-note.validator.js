const { body, param } = require('express-validator');
const { MAX_NOTE_LENGTH, MAX_TITLE_LENGTH } = require('../constants/doctor-note.constants');

/**
 * Validation rules for creating a doctor note.
 */
const createNoteRules = [
  body('patientId')
    .exists().withMessage('Patient ID is required.')
    .isInt({ min: 1 }).withMessage('Patient ID must be a positive integer.'),

  body('appointmentId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer.'),

  body('title')
    .exists().withMessage('Title is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_TITLE_LENGTH })
    .withMessage(`Title must be between 1 and ${MAX_TITLE_LENGTH} characters.`),

  body('note')
    .exists().withMessage('Note is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_NOTE_LENGTH })
    .withMessage(`Note must be between 1 and ${MAX_NOTE_LENGTH} characters.`)
];

/**
 * Validation rules for updating a doctor note.
 */
const updateNoteRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Note ID must be a positive integer.'),

  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_TITLE_LENGTH })
    .withMessage(`Title must be between 1 and ${MAX_TITLE_LENGTH} characters.`),

  body('note')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_NOTE_LENGTH })
    .withMessage(`Note must be between 1 and ${MAX_NOTE_LENGTH} characters.`)
];

/**
 * Validation rules for archive or get single note param.
 */
const noteIdRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Note ID must be a positive integer.')
];

module.exports = {
  createNoteRules,
  updateNoteRules,
  noteIdRules
};
