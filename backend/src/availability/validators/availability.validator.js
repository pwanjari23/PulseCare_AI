const { body } = require('express-validator');
const { WEEK_DAYS, TIME_FORMAT, MIN_SLOT_DURATION, MAX_SLOT_DURATION, calculateDurationMinutes } = require('../constants/availability.constants');

/**
 * Validation rules for creating or updating doctor availability
 */
const availabilityRules = [
  body('dayOfWeek')
    .exists().withMessage('Day of week is required')
    .trim()
    .isIn(WEEK_DAYS).withMessage(`Day of week must be one of: ${WEEK_DAYS.join(', ')}`),

  body('startTime')
    .exists().withMessage('Start time is required')
    .trim()
    .matches(TIME_FORMAT).withMessage('Start time must be in HH:mm format'),

  body('endTime')
    .exists().withMessage('End time is required')
    .trim()
    .matches(TIME_FORMAT).withMessage('End time must be in HH:mm format')
    .custom((endTime, { req }) => {
      const startTime = req.body.startTime;
      if (!startTime || !endTime) return true;

      const duration = calculateDurationMinutes(startTime, endTime);
      if (duration <= 0) {
        throw new Error('End time must be strictly after start time');
      }

      if (duration < MIN_SLOT_DURATION) {
        throw new Error(`Availability slot must be at least ${MIN_SLOT_DURATION} minutes`);
      }

      if (duration > MAX_SLOT_DURATION) {
        throw new Error(`Availability slot cannot exceed ${MAX_SLOT_DURATION / 60} hours`);
      }

      return true;
    })
];

module.exports = {
  availabilityRules
};
