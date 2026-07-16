const { validationResult, matchedData } = require('express-validator');
const notificationService = require('../services/notification.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Gets notifications for the authenticated user (supports pagination).
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await notificationService.getMyNotifications(req.user.id, page, limit);
    return res.status(200).json(
      new ApiResponse(200, data, 'User notifications retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets unread notifications for the authenticated user (supports pagination).
 */
const getUnreadNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await notificationService.getUnreadNotifications(req.user.id, page, limit);
    return res.status(200).json(
      new ApiResponse(200, data, 'User unread notifications retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets unread notifications count for the authenticated user.
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, count, 'User unread notifications count retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Marks a single notification as read.
 */
const markNotificationRead = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const { id } = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const record = await notificationService.markNotificationRead(req.user.id, id, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, record, 'Notification marked as read successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Marks all notifications for a user as read.
 */
const markAllNotificationsRead = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await notificationService.markAllNotificationsRead(req.user.id, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, result, 'All notifications marked as read successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Gets notifications for another user (Admin only, supports pagination).
 */
const getNotificationsForAdmin = async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    if (!targetUserId) {
      throw new ApiError(400, 'Target user ID must be a valid integer.');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await notificationService.getNotificationsForAdmin(targetUserId, page, limit);
    return res.status(200).json(
      new ApiResponse(200, data, 'User notifications retrieved successfully by Admin.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationsForAdmin
};
