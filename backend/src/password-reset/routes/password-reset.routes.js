const { Router } = require('express');
const controller = require('../controllers/password-reset.controller');
const { forgotPasswordRules, resetPasswordRules } = require('../validators/password-reset.validator');

const router = Router();

/**
 * Request password reset instructions
 * POST /api/v1/password-reset/forgot
 */
router.post('/forgot', forgotPasswordRules, controller.forgotPassword);

/**
 * Execute password reset
 * POST /api/v1/password-reset/reset
 */
router.post('/reset', resetPasswordRules, controller.resetPassword);

module.exports = router;
