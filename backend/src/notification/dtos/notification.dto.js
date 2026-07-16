/**
 * Maps a Sequelize notification model instance to a client-facing DTO.
 * @param {object} record - Sequelize record instance
 * @returns {object|null} Sanitized notification DTO
 */
const toNotificationDto = (record) => {
  if (!record) return null;

  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.notificationType,
    payload: typeof data.payload === 'string' ? JSON.parse(data.payload) : (data.payload || null),
    isRead: data.isRead,
    createdAt: data.createdAt || data.created_at || null
  };
};

module.exports = {
  toNotificationDto
};
