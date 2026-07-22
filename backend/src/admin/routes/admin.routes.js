const { Router } = require('express');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

const router = Router();

// Retrieve all admins (Admin only)
router.get('/', authenticate, authorize('Admin'), adminController.getAdmins);

module.exports = router;
