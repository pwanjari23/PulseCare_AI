const { body } = require('express-validator');

/**
 * Validation rules for recording or updating vital signs
 */
const vitalRules = [
  body('heartRate')
    .exists().withMessage('Heart rate is required')
    .isInt({ min: 20, max: 250 }).withMessage('Heart rate must be an integer between 20 and 250'),

  body('spo2')
    .exists().withMessage('SPO2 is required')
    .isInt({ min: 50, max: 100 }).withMessage('SPO2 must be an integer between 50 and 100'),

  body('temperature')
    .exists().withMessage('Temperature is required')
    .isFloat({ min: 30.0, max: 45.0 }).withMessage('Temperature must be a decimal between 30.0 and 45.0'),

  body('systolicBp')
    .exists().withMessage('Systolic BP is required')
    .isInt({ min: 50, max: 250 }).withMessage('Systolic BP must be an integer between 50 and 250'),

  body('diastolicBp')
    .exists().withMessage('Diastolic BP is required')
    .isInt({ min: 30, max: 180 }).withMessage('Diastolic BP must be an integer between 30 and 180'),

  body('glucose')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 20, max: 700 }).withMessage('Glucose must be an integer between 20 and 700'),

  body('weightKg')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 1.0, max: 500.0 }).withMessage('Weight must be a decimal between 1.0 and 500.0'),

  body('heightCm')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 20.0, max: 300.0 }).withMessage('Height must be a decimal between 20.0 and 300.0'),

  body('recordedAt')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isISO8601().withMessage('Recorded date must be a valid ISO8601 date')
    .custom((value) => {
      const date = new Date(value);
      if (date > new Date()) {
        throw new Error('Recorded date cannot be in the future');
      }
      return true;
    })
];

module.exports = {
  vitalRules
};
