const { sequelize } = require('#models/index.js');
const notificationRepository = require('../repositories/notification.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const { toNotificationDto } = require('../dtos/notification.dto');
const { NOTIFICATION_READ, ALL_NOTIFICATIONS_READ } = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Creates a single notification.
 * Transport-independent and future-ready.
 */
const createNotification = async (data, transaction) => {
  const record = await notificationRepository.createNotification({
    recipientId: data.recipientId,
    title: data.title,
    message: data.message,
    notificationType: data.type,
    payload: data.payload || null
  }, transaction);

  // Future Socket.io event emission can be placed here

  return toNotificationDto(record);
};

/**
 * Creates multiple notifications in bulk.
 */
const createManyNotifications = async (dataArray, transaction) => {
  const mapped = dataArray.map(item => ({
    recipientId: item.recipientId,
    title: item.title,
    message: item.message,
    notificationType: item.type,
    payload: item.payload || null
  }));

  const records = await notificationRepository.createManyNotifications(mapped, transaction);

  // Future Socket.io bulk emissions can be placed here

  return records.map(toNotificationDto);
};

/**
 * Retrieves notifications for the logged-in user, with pagination.
 */
const getMyNotifications = async (userId, page = 1, limit = 20) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;

  const { rows, count } = await notificationRepository.findUserNotifications(userId, pageNum, limitNum);

  const totalPages = Math.ceil(count / limitNum);

  return {
    notifications: rows.map(toNotificationDto),
    totalRecords: count,
    totalPages,
    currentPage: pageNum,
    limit: limitNum
  };
};

/**
 * Retrieves unread notifications for the logged-in user, with pagination.
 */
const getUnreadNotifications = async (userId, page = 1, limit = 20) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;

  const { rows, count } = await notificationRepository.findUnreadNotifications(userId, pageNum, limitNum);

  const totalPages = Math.ceil(count / limitNum);

  return {
    notifications: rows.map(toNotificationDto),
    totalRecords: count,
    totalPages,
    currentPage: pageNum,
    limit: limitNum
  };
};

/**
 * Gets unread count.
 */
const getUnreadCount = async (userId) => {
  const count = await notificationRepository.countUnreadNotifications(userId);
  return { unread: count };
};

/**
 * Marks a single notification as read.
 */
const markNotificationRead = async (userId, notificationId, metadata = {}) => {
  const record = await notificationRepository.findNotificationById(notificationId);
  if (!record) {
    throw new ApiError(404, 'Notification not found.');
  }

  // Ownership verification
  if (record.recipientId !== userId) {
    throw new ApiError(403, 'You are not authorized to access this notification.');
  }

  // Ignore already-read notifications
  if (record.isRead) {
    return toNotificationDto(record);
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await notificationRepository.markNotificationRead(notificationId, transaction);

    await authRepository.insertActivityLog({
      userId,
      action: NOTIFICATION_READ,
      module: 'Notification Management',
      entity: 'Notification',
      entityId: notificationId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await notificationRepository.findNotificationById(notificationId);
    return toNotificationDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Mark notification read transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Marks all unread notifications for a user as read.
 */
const markAllNotificationsRead = async (userId, metadata = {}) => {
  const unreadCount = await notificationRepository.countUnreadNotifications(userId);
  if (unreadCount === 0) {
    return { success: true };
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await notificationRepository.markAllNotificationsRead(userId, transaction);

    await authRepository.insertActivityLog({
      userId,
      action: ALL_NOTIFICATIONS_READ,
      module: 'Notification Management',
      entity: 'Notification',
      entityId: userId, // recipient user ID as entity ID anchor for read-all
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;
    return { success: true };
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Mark all notifications read transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Administrator notification retrieval for a user.
 */
const getNotificationsForAdmin = async (recipientId, page = 1, limit = 20) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;

  const { rows, count } = await notificationRepository.findUserNotifications(recipientId, pageNum, limitNum);

  const totalPages = Math.ceil(count / limitNum);

  return {
    notifications: rows.map(toNotificationDto),
    totalRecords: count,
    totalPages,
    currentPage: pageNum,
    limit: limitNum
  };
};

module.exports = {
  createNotification,
  createManyNotifications,
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationsForAdmin
};
