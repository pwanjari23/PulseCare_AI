const { body } = require('express-validator');

/**
 * Validation rules for user login
 */
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

/**
 * Validation rules for Patient registration
 */
const registerPatientRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .escape(),
  body('gender')
    .trim()
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('dateOfBirth')
    .trim()
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Date of birth must be a valid date in YYYY-MM-DD format'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Phone must be a string')
    .escape(),
  body('bloodType')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('zipCode')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Zip code must be a string')
    .escape(),
  body('heightCm')
    .optional({ nullable: true, checkFalsy: true })
    .isDecimal().withMessage('Height must be a valid decimal number'),
  body('emergencyContactName')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Emergency contact name must be a string')
    .escape(),
  body('emergencyContactPhone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Emergency contact phone must be a string')
    .escape(),
  body('emergencyContactRelation')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Emergency contact relation must be a string')
    .escape(),
  body('medicalConditions')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .escape(),
  body('allergies')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .escape(),
  body('smokingStatus')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['Non-smoker', 'Former smoker', 'Active smoker']).withMessage('Invalid smoking status'),
  body('alcoholConsumption')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['None', 'Occasional', 'Regular', 'Heavy']).withMessage('Invalid alcohol consumption status')
];

/**
 * Validation rules for Doctor registration
 */
const registerDoctorRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .escape(),
  body('licenseNumber')
    .trim()
    .notEmpty().withMessage('License number is required')
    .isString().withMessage('License number must be a string')
    .escape(),
  body('specializationId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Specialization ID must be a positive integer'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Phone must be a string')
    .escape(),
  body('clinicName')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic name must be a string')
    .escape(),
  body('clinicAddress')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic address must be a string')
    .escape(),
  body('clinicZip')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Clinic zip must be a string')
    .escape(),
  body('experienceYears')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0, max: 100 }).withMessage('Experience years must be a valid integer between 0 and 100'),
  body('languages')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString().withMessage('Languages must be a string')
    .escape(),
  body('consultationFee')
    .optional({ nullable: true, checkFalsy: true })
    .isDecimal().withMessage('Consultation fee must be a valid decimal number')
];

/**
 * Validation rules for token refresh and logout operations
 */
const refreshTokenRules = [
  body('refreshToken')
    .trim()
    .notEmpty().withMessage('Refresh token is required')
    .isString().withMessage('Refresh token must be a string')
];

module.exports = {
  loginRules,
  registerPatientRules,
  registerDoctorRules,
  refreshTokenRules
};
