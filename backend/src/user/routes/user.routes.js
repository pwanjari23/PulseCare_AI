const { Router } = require('express');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');
const userController = require('../controllers/user.controller');

const router = Router();

// Retrieve all users (Admin only)
router.get('/', authenticate, authorize('Admin'), userController.getUsers);

// Retrieve single user (Admin only)
router.get('/:id', authenticate, authorize('Admin'), userController.getUserById);

// Update user details (Admin only)
router.patch('/:id', authenticate, authorize('Admin'), userController.updateUser);

// Delete user account (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);

module.exports = router;
