const { Router } = require('express');
const { ApiResponse } = require('../utils/apiResponse');

const router = Router();

/**
 * Health check route to verify service availability
 */
router.get('/health', (req, res) => {
  const healthInfo = {
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
  };
  res.status(200).json(new ApiResponse(200, healthInfo, 'PulseCare AI API is running healthy'));
});

// Future routes can be registered here:
router.use('/auth', require('../auth/routes/auth.routes'));
router.use('/doctors', require('../doctor/routes/doctor.routes'));
router.use('/patients', require('../patient/routes/patient.routes'));
router.use('/appointments', require('../appointment/routes/appointment.routes'));
router.use('/vitals', require('../vitals/routes/vital.routes'));
router.use('/availability', require('../availability/routes/availability.routes'));
router.use('/notifications', require('../notification/routes/notification.routes'));
router.use('/prescriptions', require('../prescription/routes/prescription.routes'));
router.use('/doctor-notes', require('../doctor-notes/routes/doctor-note.routes'));
router.use('/health-summary', require('../ai/routes/health-summary.routes'));
router.use('/dashboard', require('../dashboard/routes/dashboard.routes'));
router.use('/upload', require('../upload/routes/upload.routes'));

// Temporary protected verification routes for testing middleware
const { authenticate, authorize } = require('../auth/middleware/auth.middleware');
const doctorController = require('../doctor/controllers/doctor.controller');

router.get('/admin/doctors/:id', authenticate, authorize('Admin'), doctorController.getProfileForAdmin);

router.get('/profile', authenticate, (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'Profile retrieved successfully.'));
});

router.get('/doctor/test', authenticate, authorize('Doctor'), (req, res) => {
  res.status(200).json(new ApiResponse(200, { success: true, message: 'Doctor authentication verified.' }, 'Doctor verification successful.'));
});

router.get('/patient/test', authenticate, authorize('Patient'), (req, res) => {
  res.status(200).json(new ApiResponse(200, { success: true, message: 'Patient authentication verified.' }, 'Patient verification successful.'));
});

router.get('/admin/test', authenticate, authorize('Admin'), (req, res) => {
  res.status(200).json(new ApiResponse(200, { success: true, message: 'Admin authentication verified.' }, 'Admin verification successful.'));
});

module.exports = router;
