const { body, param } = require('express-validator');
const {
  MAX_DIAGNOSIS_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_MEDICINES_PER_PRESCRIPTION,
  MIN_MEDICINES_PER_PRESCRIPTION,
  MAX_MEDICINE_NAME_LENGTH,
  MAX_DOSAGE_LENGTH,
  MAX_FREQUENCY_LENGTH,
  MIN_DURATION_DAYS,
  MAX_DURATION_DAYS,
  MAX_INSTRUCTION_LENGTH
} = require('../constants/prescription.constants');

/**
 * Shared medicine item validation rules.
 */
const itemsRules = [
  body('items')
    .isArray({ min: MIN_MEDICINES_PER_PRESCRIPTION, max: MAX_MEDICINES_PER_PRESCRIPTION })
    .withMessage(`Prescription must contain between ${MIN_MEDICINES_PER_PRESCRIPTION} and ${MAX_MEDICINES_PER_PRESCRIPTION} medicines.`),

  body('items.*.medicineName')
    .exists().withMessage('Medicine name is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_MEDICINE_NAME_LENGTH })
    .withMessage(`Medicine name must be at most ${MAX_MEDICINE_NAME_LENGTH} characters.`),

  body('items.*.dosage')
    .exists().withMessage('Dosage is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_DOSAGE_LENGTH })
    .withMessage(`Dosage must be at most ${MAX_DOSAGE_LENGTH} characters.`),

  body('items.*.frequency')
    .exists().withMessage('Frequency is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_FREQUENCY_LENGTH })
    .withMessage(`Frequency must be at most ${MAX_FREQUENCY_LENGTH} characters.`),

  body('items.*.durationDays')
    .exists().withMessage('Duration in days is required.')
    .isInt({ min: MIN_DURATION_DAYS, max: MAX_DURATION_DAYS })
    .withMessage(`Duration must be an integer between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS}.`),

  body('items.*.instructions')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: MAX_INSTRUCTION_LENGTH })
    .withMessage(`Instructions must be at most ${MAX_INSTRUCTION_LENGTH} characters.`)
];

/**
 * Validation rules for creating a new prescription.
 */
const createPrescriptionRules = [
  body('patientId')
    .exists().withMessage('Patient ID is required.')
    .isInt({ min: 1 }).withMessage('Patient ID must be a positive integer.'),

  body('appointmentId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer.'),

  body('diagnosis')
    .exists().withMessage('Diagnosis is required.')
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_DIAGNOSIS_LENGTH })
    .withMessage(`Diagnosis must be at most ${MAX_DIAGNOSIS_LENGTH} characters.`),

  body('notes')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: MAX_NOTES_LENGTH })
    .withMessage(`Notes must be at most ${MAX_NOTES_LENGTH} characters.`),

  body('followUpDate')
    .optional({ nullable: true })
    .isDate().withMessage('Follow-up date must be a valid date (YYYY-MM-DD).'),

  ...itemsRules
];

/**
 * Validation rules for updating a prescription.
 */
const updatePrescriptionRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Prescription ID must be a positive integer.'),

  body('diagnosis')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: MAX_DIAGNOSIS_LENGTH })
    .withMessage(`Diagnosis must be at most ${MAX_DIAGNOSIS_LENGTH} characters.`),

  body('notes')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: MAX_NOTES_LENGTH })
    .withMessage(`Notes must be at most ${MAX_NOTES_LENGTH} characters.`),

  body('followUpDate')
    .optional({ nullable: true })
    .isDate().withMessage('Follow-up date must be a valid date (YYYY-MM-DD).'),

  body('appointmentId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Appointment ID must be a positive integer.'),

  ...itemsRules
];

/**
 * Validation rules for prescription ID param.
 */
const prescriptionIdRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('Prescription ID must be a positive integer.')
];

module.exports = {
  createPrescriptionRules,
  updatePrescriptionRules,
  prescriptionIdRules
};
