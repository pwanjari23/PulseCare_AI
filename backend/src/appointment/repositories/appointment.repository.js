const { Appointment, Patient, Doctor, Specialization, User } = require('#models/index.js');
const { Op } = require('sequelize');

/**
 * Finds an appointment by ID including related patient/doctor profiles.
 * @param {number|string} id - Appointment ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Appointment|null>} The Appointment instance
 */
const findAppointmentById = async (id, transaction) => {
  return Appointment.findByPk(id, {
    include: [
      { model: Patient, as: 'patient' },
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      }
    ],
    transaction
  });
};

/**
 * Creates a new appointment record.
 * @param {object} data - Field values
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<Appointment>} Created appointment
 */
const createAppointment = async (data, transaction) => {
  return Appointment.create(data, { transaction });
};

/**
 * Updates an appointment record.
 * @param {number|string} id - Appointment ID
 * @param {object} data - Update payload
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<[number]>} Number of affected rows
 */
const updateAppointment = async (id, data, transaction) => {
  return Appointment.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Finds all appointments for a doctor.
 * @param {number|string} doctorId - Doctor ID
 * @returns {Promise<Appointment[]>} List of appointments
 */
const findDoctorAppointments = async (doctorId) => {
  return Appointment.findAll({
    where: { doctorId },
    order: [['appointmentAt', 'DESC']],
    include: [{ model: Patient, as: 'patient' }]
  });
};

/**
 * Finds all appointments for a patient.
 * @param {number|string} patientId - Patient ID
 * @returns {Promise<Appointment[]>} List of appointments
 */
const findPatientAppointments = async (patientId) => {
  return Appointment.findAll({
    where: { patientId },
    order: [['appointmentAt', 'DESC']],
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      }
    ]
  });
};

/**
 * Verifies that a doctor exists, is verified, and active.
 * @param {number|string} doctorId - Doctor ID
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<Doctor|null>} Doctor record if verified and active, null otherwise
 */
const checkDoctorAvailability = async (doctorId, transaction) => {
  return Doctor.findOne({
    where: { id: doctorId, isVerified: true },
    include: [{
      model: User,
      as: 'user',
      where: { status: 'Active' }
    }],
    transaction
  });
};

/**
 * Evaluates whether any Scheduled appointments conflict with a requested slot.
 * Overlap formula: newStart < existingEnd AND newEnd > existingStart.
 * @param {number|string} doctorId - Doctor ID
 * @param {Date|string} scheduledAt - Requested time slot
 * @param {number} durationMinutes - Booking duration (15-120 minutes)
 * @param {number|string} [excludeAppointmentId] - Excludes a specific appointment from conflict checks
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<Appointment|null>} The overlapping appointment record, or undefined if no conflict
 */
const checkOverlappingAppointments = async (doctorId, scheduledAt, durationMinutes, excludeAppointmentId = null, transaction) => {
  const newStart = new Date(scheduledAt);
  // Subtract/add duration to prevent overlapping slots from conflicting
  const bufferStart = new Date(newStart.getTime() - (durationMinutes - 0.01) * 60 * 1000);
  const bufferEnd = new Date(newStart.getTime() + (durationMinutes - 0.01) * 60 * 1000);

  const where = {
    doctorId,
    status: 'Scheduled',
    appointmentAt: {
      [Op.between]: [bufferStart, bufferEnd]
    }
  };

  if (excludeAppointmentId) {
    where.id = { [Op.ne]: excludeAppointmentId };
  }

  return Appointment.findOne({
    where,
    transaction
  });
};

module.exports = {
  findAppointmentById,
  createAppointment,
  updateAppointment,
  findDoctorAppointments,
  findPatientAppointments,
  checkDoctorAvailability,
  checkOverlappingAppointments
};
