const { dayNumericToString } = require('../constants/availability.constants');

const formatTime = (t) => {
  if (!t) return null;
  // If time is HH:mm:ss, truncate to HH:mm
  return t.length > 5 ? t.slice(0, 5) : t;
};

/**
 * Maps Sequelize availability to complete Private DTO for doctors.
 * @param {object} record - Sequelize instance
 * @returns {object} Private DTO
 */
const toPrivateAvailabilityDto = (record) => {
  if (!record) return null;

  return {
    id: record.id,
    doctorId: record.doctorId,
    dayOfWeek: dayNumericToString(record.dayOfWeek),
    startTime: formatTime(record.startTime),
    endTime: formatTime(record.endTime),
    isAvailable: record.isAvailable,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
};

/**
 * Maps Sequelize availability to Public DTO for patients.
 * Excludes internal database primary keys and statuses.
 * @param {object} record - Sequelize instance
 * @returns {object} Public DTO
 */
const toPublicAvailabilityDto = (record) => {
  if (!record) return null;

  return {
    dayOfWeek: dayNumericToString(record.dayOfWeek),
    startTime: formatTime(record.startTime),
    endTime: formatTime(record.endTime)
  };
};

module.exports = {
  toPrivateAvailabilityDto,
  toPublicAvailabilityDto
};
