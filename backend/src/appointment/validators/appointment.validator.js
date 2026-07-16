const { body } = require('express-validator');

/**
 * Validation rules for booking an appointment
 */
const bookAppointmentRules = [
  body('doctorId')
    .exists().withMessage('Doctor ID is required')
    .isInt({ min: 1 }).withMessage('Doctor ID must be a positive integer'),

  body('scheduledAt')
    .exists().withMessage('Scheduled date is required')
    .trim()
    .isISO8601().withMessage('Scheduled date must be a valid ISO8601 datetime')
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('Appointment scheduled date must be in the future');
      }
      return true;
    }),

  body('durationMinutes')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 15, max: 120 }).withMessage('Duration must be between 15 and 120 minutes'),

  body('reason')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Reason must be a string')
    .isLength({ max: 1000 }).withMessage('Reason cannot exceed 1000 characters')
];

/**
 * Validation rules for completing an appointment
 */
const completeAppointmentRules = [
  body('notes')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Notes must be a string')
    .isLength({ max: 3000 }).withMessage('Notes cannot exceed 3000 characters')
];

module.exports = {
  bookAppointmentRules,
  completeAppointmentRules
};
