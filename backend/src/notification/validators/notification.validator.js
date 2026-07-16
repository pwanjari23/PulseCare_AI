const { param } = require('express-validator');

/**
 * Validation rules for marking a notification as read
 */
const markAsReadRules = [
  param('id')
    .exists().withMessage('Notification ID is required')
    .isInt({ min: 1 }).withMessage('Notification ID must be a positive integer')
];

module.exports = {
  markAsReadRules
};
