const { body } = require('express-validator');

/**
 * Validation rules for updating the Doctor profile
 */
const updateProfileRules = [
  body('specializationId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Specialization ID must be a positive integer'),

  body('clinicName')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic name must be a string')
    .isLength({ max: 150 }).withMessage('Clinic name cannot exceed 150 characters'),

  body('clinicAddress')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic address must be a string')
    .isLength({ max: 255 }).withMessage('Clinic address cannot exceed 255 characters'),

  body('clinicZip')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic ZIP must be a string')
    .isLength({ max: 15 }).withMessage('Clinic ZIP cannot exceed 15 characters'),

  body('experienceYears')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0, max: 60 }).withMessage('Experience must be an integer between 0 and 60'),

  body('consultationFee')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0, max: 50000 }).withMessage('Consultation fee must be a number between 0 and 50000'),

  body('languages')
    .optional({ nullable: true, checkFalsy: true })
    .isArray().withMessage('Languages must be an array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('Languages array cannot exceed 10 entries');
      }
      const unique = new Set(value.map(s => String(s).toLowerCase().trim()));
      if (unique.size !== value.length) {
        throw new Error('Languages array cannot contain duplicate entries');
      }
      for (const lang of value) {
        if (typeof lang !== 'string' || lang.trim() === '') {
          throw new Error('All languages must be non-empty strings');
        }
      }
      return true;
    }),

  body('bio')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Bio must be a string')
    .isLength({ max: 2000 }).withMessage('Bio cannot exceed 2000 characters'),

  body('profileImage')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL().withMessage('Profile image must be a valid URL')
    .isLength({ max: 255 }).withMessage('Profile image URL cannot exceed 255 characters')
];

// Let's fix the clinicZip validation to max 15 to match the database column
const zipRuleIndex = updateProfileRules.findIndex(r => r.builder && r.builder.fields && r.builder.fields.includes('clinicZip'));
if (zipRuleIndex !== -1) {
  // Just in case, let's keep it simple and declare the array cleanly
}

module.exports = {
  updateProfileRules
};
