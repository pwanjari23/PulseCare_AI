const { Router } = require('express');
const { registerPatientRules, registerDoctorRules, loginRules, refreshTokenRules } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = Router();

/**
 * Patient registration endpoint
 * POST /api/auth/register/patient
 */
router.post('/register/patient', registerPatientRules, authController.registerPatient);

/**
 * Doctor registration endpoint
 * POST /api/auth/register/doctor
 */
router.post('/register/doctor', registerDoctorRules, authController.registerDoctor);

/**
 * User login endpoint
 * POST /api/auth/login
 */
router.post('/login', loginRules, authController.login);

/**
 * Token refresh endpoint
 * POST /api/auth/refresh
 */
router.post('/refresh', refreshTokenRules, authController.refreshToken);

/**
 * User logout endpoint
 * POST /api/auth/logout
 */
router.post('/logout', refreshTokenRules, authController.logout);

module.exports = router;
