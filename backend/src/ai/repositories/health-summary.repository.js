const {
  Patient,
  User,
  VitalsLog,
  VitalsAlert,
  Appointment,
  Prescription,
  PrescriptionItem,
  DoctorNote,
  Doctor,
  Specialization
} = require('#models/index.js');

/**
 * Finds patient profile with user details.
 */
const findPatient = async (patientId, transaction) => {
  return Patient.findOne({
    where: { id: patientId },
    include: [{ model: User, as: 'user' }],
    transaction
  });
};

/**
 * Finds the single latest vitals log for a patient.
 */
const findLatestVitals = async (patientId, transaction) => {
  return VitalsLog.findOne({
    where: { patientId },
    order: [['logged_at', 'DESC']],
    transaction
  });
};

/**
 * Finds all active (Open or Acknowledged) vitals alerts for a patient.
 */
const findOpenAlerts = async (patientId, transaction) => {
  return VitalsAlert.findAll({
    where: {
      patientId,
      status: ['Open', 'Acknowledged']
    },
    order: [['created_at', 'DESC']],
    transaction
  });
};

/**
 * Finds recent appointments for a patient (newest first).
 */
const findRecentAppointments = async (patientId, limit = 5, transaction) => {
  return Appointment.findAll({
    where: { patientId },
    limit,
    order: [['appointment_at', 'DESC']],
    include: [
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
 * Finds recent prescriptions for a patient (newest first).
 */
const findRecentPrescriptions = async (patientId, limit = 5, transaction) => {
  return Prescription.findAll({
    where: { patientId },
    limit,
    order: [['prescribed_at', 'DESC']],
    include: [
      {
        model: PrescriptionItem,
        as: 'items'
      }
    ],
    transaction
  });
};

/**
 * Finds recent doctor notes for a patient (newest first, excluding archived).
 */
const findRecentDoctorNotes = async (patientId, limit = 5, transaction) => {
  return DoctorNote.findAll({
    where: {
      patientId,
      isArchived: false
    },
    limit,
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Doctor,
        as: 'doctor'
      }
    ],
    transaction
  });
};

module.exports = {
  findPatient,
  findLatestVitals,
  findOpenAlerts,
  findRecentAppointments,
  findRecentPrescriptions,
  findRecentDoctorNotes
};
