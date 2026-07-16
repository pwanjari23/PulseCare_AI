const { DoctorAvailability, Appointment } = require('#models/index.js');
const { Op } = require('sequelize');

/**
 * Finds all availability records for a doctor.
 */
const findDoctorAvailability = async (doctorId) => {
  return DoctorAvailability.findAll({
    where: { doctorId },
    order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
  });
};

/**
 * Finds a single availability slot by ID.
 */
const findAvailabilityById = async (id, transaction) => {
  return DoctorAvailability.findByPk(id, { transaction });
};

/**
 * Creates a new availability block.
 */
const createAvailability = async (data, transaction) => {
  return DoctorAvailability.create(data, { transaction });
};

/**
 * Updates an availability block.
 */
const updateAvailability = async (id, data, transaction) => {
  return DoctorAvailability.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Soft deletes an availability block.
 */
const softDeleteAvailability = async (id, transaction) => {
  return DoctorAvailability.destroy({
    where: { id },
    transaction
  });
};

/**
 * Disables an availability block.
 */
const disableAvailability = async (id, transaction) => {
  return DoctorAvailability.update({ isAvailable: false }, {
    where: { id },
    transaction
  });
};

/**
 * Finds all active, verified, enabled availability blocks for a doctor.
 */
const findPublicAvailability = async (doctorId) => {
  return DoctorAvailability.findAll({
    where: {
      doctorId,
      isAvailable: true
    },
    order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
  });
};

/**
 * Evaluates overlapping availability blocks for the same weekday.
 */
const checkOverlappingAvailability = async (doctorId, dayOfWeek, startTime, endTime, excludeId = null, transaction) => {
  const where = {
    doctorId,
    dayOfWeek,
    startTime: { [Op.lt]: endTime },
    endTime: { [Op.gt]: startTime }
  };

  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }

  return DoctorAvailability.findOne({
    where,
    transaction
  });
};

/**
 * Checks if a requested slot is fully within an enabled availability window.
 */
const findAvailabilityForBooking = async (doctorId, dayOfWeek, startTime, endTime, transaction) => {
  return DoctorAvailability.findOne({
    where: {
      doctorId,
      dayOfWeek,
      isAvailable: true,
      startTime: { [Op.lte]: startTime },
      endTime: { [Op.gte]: endTime }
    },
    transaction
  });
};

/**
 * Helper to parse time string "HH:mm" to minutes.
 */
const parseTimeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const hasFutureAppointments = async (doctorId, dayOfWeek, startTime, endTime, transaction) => {
  // Load future active Scheduled bookings for the doctor
  const futureAppointments = await Appointment.findAll({
    where: {
      doctorId,
      status: 'Scheduled',
      appointmentAt: { [Op.gt]: new Date() }
    },
    transaction
  });

  const slotStartMins = parseTimeToMinutes(startTime);
  const slotEndMins = parseTimeToMinutes(endTime);

  const dependentAppointment = futureAppointments.find(app => {
    const appDate = new Date(app.appointmentAt);

    // 1. Matches weekday index (0-6)
    if (appDate.getDay() !== dayOfWeek) return false;

    // 2. Evaluates time overlap
    const appStartMins = appDate.getHours() * 60 + appDate.getMinutes();
    const appEndMins = appStartMins + (app.durationMinutes || 30);

    return appStartMins < slotEndMins && appEndMins > slotStartMins;
  });

  return !!dependentAppointment;
};

module.exports = {
  findDoctorAvailability,
  findAvailabilityById,
  createAvailability,
  updateAvailability,
  softDeleteAvailability,
  disableAvailability,
  findPublicAvailability,
  checkOverlappingAvailability,
  findAvailabilityForBooking,
  hasFutureAppointments
};
