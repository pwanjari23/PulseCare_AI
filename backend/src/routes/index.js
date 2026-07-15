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
// router.use('/patients', patientRouter);
// router.use('/doctors', doctorRouter);

module.exports = router;
