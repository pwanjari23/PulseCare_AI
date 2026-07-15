const { body } = require('express-validator');

/**
 * Validation rules for user login
 */
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for user registration
 */
const registerRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .trim()
    .notEmpty().withMessage('Role selection is required')
    .isIn(['Admin', 'Doctor', 'Patient']).withMessage('Invalid role choice provided')
];

module.exports = {
  loginRules,
  registerRules
};
