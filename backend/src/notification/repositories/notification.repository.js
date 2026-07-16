const { Notification, Sequelize } = require('#models/index.js');

/**
 * Creates a single notification.
 */
const createNotification = async (data, transaction) => {
  return Notification.create(data, { transaction });
};

/**
 * Creates multiple notifications in bulk.
 */
const createManyNotifications = async (dataArray, transaction) => {
  return Notification.bulkCreate(dataArray, { transaction });
};

/**
 * Finds a notification by primary key.
 */
const findNotificationById = async (id, transaction) => {
  return Notification.findByPk(id, { transaction });
};

/**
 * Finds a notification specifically for a recipient.
 */
const findUserNotificationById = async (recipientId, id, transaction) => {
  return Notification.findOne({
    where: { id, recipientId },
    transaction
  });
};

/**
 * Finds all notifications for a recipient, supporting pagination.
 * Ordered by created_at DESC, id DESC.
 */
const findUserNotifications = async (recipientId, page = 1, limit = 20, transaction) => {
  const offset = (page - 1) * limit;

  return Notification.findAndCountAll({
    where: { recipientId },
    limit,
    offset,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
    transaction
  });
};

/**
 * Finds unread notifications for a recipient, supporting pagination.
 * Ordered by created_at DESC, id DESC.
 */
const findUnreadNotifications = async (recipientId, page = 1, limit = 20, transaction) => {
  const offset = (page - 1) * limit;

  return Notification.findAndCountAll({
    where: { recipientId, isRead: false },
    limit,
    offset,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
    transaction
  });
};

/**
 * Marks a notification as read.
 */
const markNotificationRead = async (id, transaction) => {
  return Notification.update(
    { isRead: true },
    { where: { id }, transaction }
  );
};

/**
 * Marks all unread notifications for a user as read.
 */
const markAllNotificationsRead = async (recipientId, transaction) => {
  return Notification.update(
    { isRead: true },
    { where: { recipientId, isRead: false }, transaction }
  );
};

/**
 * Counts unread notifications for a user.
 */
const countUnreadNotifications = async (recipientId, transaction) => {
  return Notification.count({
    where: { recipientId, isRead: false },
    transaction
  });
};

module.exports = {
  createNotification,
  createManyNotifications,
  findNotificationById,
  findUserNotificationById,
  findUserNotifications,
  findUnreadNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  countUnreadNotifications
};
