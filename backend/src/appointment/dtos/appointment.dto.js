/**
 * Maps Sequelize appointment to the sanitized Appointment DTO.
 * Excludes sensitive user fields, timestamps of nested models, and internal metadata.
 * @param {object} app - Sequelize Appointment instance
 * @returns {object} Sanitized Appointment DTO
 */
const toAppointmentDto = (app) => {
  if (!app) return null;

  return {
    id: app.id,
    scheduledAt: app.appointmentAt,
    durationMinutes: app.durationMinutes || 30,
    reason: app.reason,
    notes: app.notes,
    status: app.status,
    createdAt: app.createdAt,
    doctor: app.doctor ? {
      id: app.doctor.id,
      firstName: app.doctor.firstName,
      lastName: app.doctor.lastName,
      specialization: app.doctor.specialization ? app.doctor.specialization.name : null
    } : null,
    patient: app.patient ? {
      id: app.patient.id,
      firstName: app.patient.firstName,
      lastName: app.patient.lastName
    } : null
  };
};

module.exports = {
  toAppointmentDto
};
