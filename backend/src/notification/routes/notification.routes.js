const { Router } = require('express');
const notificationController = require('../controllers/notification.controller');
const { markAsReadRules } = require('../validators/notification.validator');
const { authenticate, authorize } = require('../../auth/middleware/auth.middleware');

const router = Router();

/**
 * Retrieves all notifications for the authenticated user (Patients, Doctors, and Admins).
 * GET /api/v1/notifications
 */
router.get('/', authenticate, notificationController.getMyNotifications);

/**
 * Retrieves all unread notifications for the authenticated user.
 * GET /api/v1/notifications/unread
 */
router.get('/unread', authenticate, notificationController.getUnreadNotifications);

/**
 * Retrieves unread notification counts for the authenticated user.
 * GET /api/v1/notifications/unread-count
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

/**
 * Marks all notifications as read.
 * PATCH /api/v1/notifications/read-all
 */
router.patch('/read-all', authenticate, notificationController.markAllNotificationsRead);

/**
 * Marks a single notification as read.
 * PATCH /api/v1/notifications/:id/read
 */
router.patch('/:id/read', authenticate, markAsReadRules, notificationController.markNotificationRead);

/**
 * Admin endpoint to retrieve notifications for any specific user.
 * GET /api/v1/notifications/user/:userId
 */
router.get('/user/:userId', authenticate, authorize('Admin'), notificationController.getNotificationsForAdmin);

module.exports = router;
