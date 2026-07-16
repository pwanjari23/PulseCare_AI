const { body } = require('express-validator');

/**
 * Custom sanitizer to trim strings and convert empty strings to null.
 */
const trimAndEmptyToNull = (value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/\s+/g, ' '); // Normalize whitespaces
    return trimmed === '' ? null : trimmed;
  }
  return value;
};

/**
 * Validation rules for updating the Patient profile
 */
const updatePatientRules = [
  body('firstName')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('First name must be a string')
    .isLength({ max: 100 }).withMessage('First name cannot exceed 100 characters'),

  body('lastName')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Last name must be a string')
    .isLength({ max: 100 }).withMessage('Last name cannot exceed 100 characters'),

  body('gender')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('dateOfBirth')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isISO8601().withMessage('Date of birth must be a valid date'),

  body('bloodType')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),

  body('heightCm')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 20, max: 300 }).withMessage('Height must be a number between 20 and 300 cm'),

  body('weightKg')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 1, max: 500 }).withMessage('Weight must be a number between 1 and 500 kg'),

  body('zipCode')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('ZIP code must be a string')
    .isLength({ max: 15 }).withMessage('ZIP code cannot exceed 15 characters'),

  body('emergencyContactName')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Emergency contact name must be a string')
    .isLength({ max: 150 }).withMessage('Emergency contact name cannot exceed 150 characters'),

  body('emergencyContactPhone')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Emergency contact phone must be a string')
    .isLength({ max: 20 }).withMessage('Emergency contact phone cannot exceed 20 characters'),

  body('emergencyContactRelation')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Emergency contact relation must be a string')
    .isLength({ max: 100 }).withMessage('Emergency contact relation cannot exceed 100 characters'),

  body('medicalConditions')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Medical conditions must be a string')
    .isLength({ max: 3000 }).withMessage('Medical conditions cannot exceed 3000 characters'),

  body('allergies')
    .optional({ nullable: true, checkFalsy: true })
    .customSanitizer(trimAndEmptyToNull)
    .isString().withMessage('Allergies must be a string')
    .isLength({ max: 3000 }).withMessage('Allergies cannot exceed 3000 characters'),

  body('smokingStatus')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['Non-smoker', 'Former smoker', 'Active smoker']).withMessage('Invalid smoking status value'),

  body('alcoholConsumption')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['None', 'Occasional', 'Regular', 'Heavy']).withMessage('Invalid alcohol consumption value')
];

module.exports = {
  updatePatientRules
};
