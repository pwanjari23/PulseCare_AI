const { Op } = require('sequelize');
const {
  User,
  Doctor,
  Patient,
  Appointment,
  VitalsLog,
  VitalsAlert,
  Prescription,
  Notification,
  DoctorRequest,
  ActivityLog,
  Specialization
} = require('#models/index.js');

// ==========================================
// PATIENT QUERIES
// ==========================================

const findPatientUpcomingAppointments = async (patientId) => {
  return Appointment.findAll({
    where: {
      patientId,
      appointmentAt: { [Op.gt]: new Date() }
    },
    order: [['appointment_at', 'ASC']],
    include: [
      {
        model: Doctor,
        as: 'doctor',
        include: [{ model: Specialization, as: 'specialization' }]
      }
    ]
  });
};

const findPatientLatestVitals = async (patientId) => {
  return VitalsLog.findOne({
    where: { patientId },
    order: [['logged_at', 'DESC']]
  });
};

const countPatientUnreadNotifications = async (patientUserId) => {
  return Notification.count({
    where: { recipientId: patientUserId, isRead: false }
  });
};

const countPatientActivePrescriptions = async (patientId) => {
  return Prescription.count({
    where: { patientId, status: 'Active' }
  });
};

const countPatientActiveAlerts = async (patientId) => {
  return VitalsAlert.count({
    where: {
      patientId,
      status: ['Open', 'Acknowledged']
    }
  });
};

// ==========================================
// DOCTOR QUERIES
// ==========================================

const findDoctorTodayAppointments = async (doctorId) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return Appointment.findAll({
    where: {
      doctorId,
      appointmentAt: { [Op.between]: [startOfToday, endOfToday] }
    },
    order: [['appointment_at', 'ASC']],
    include: [{ model: Patient, as: 'patient' }]
  });
};

const findDoctorUpcomingAppointments = async (doctorId) => {
  return Appointment.findAll({
    where: {
      doctorId,
      appointmentAt: { [Op.gt]: new Date() }
    },
    order: [['appointment_at', 'ASC']],
    include: [{ model: Patient, as: 'patient' }]
  });
};

const getDoctorClinicalPatientIds = async (doctorId) => {
  const patientIds = new Set();

  // 1. Primary Doctor assignment
  const primaryDocPatients = await Patient.findAll({
    attributes: ['id'],
    where: { primaryDoctorId: doctorId }
  });
  primaryDocPatients.forEach(p => patientIds.add(Number(p.id)));

  // 2. Accepted Doctor Request
  const acceptedRequests = await DoctorRequest.findAll({
    attributes: ['patientId'],
    where: { doctorId, status: 'Accepted' }
  });
  acceptedRequests.forEach(r => patientIds.add(Number(r.patientId)));

  // 3. Appointments
  const appointments = await Appointment.findAll({
    attributes: ['patientId'],
    where: { doctorId }
  });
  appointments.forEach(a => patientIds.add(Number(a.patientId)));

  return Array.from(patientIds);
};

const countDoctorActivePrescriptions = async (doctorId) => {
  return Prescription.count({
    where: { doctorId, status: 'Active' }
  });
};

const countDoctorOpenAlerts = async (doctorId) => {
  return VitalsAlert.count({
    where: {
      doctorId,
      status: ['Open', 'Acknowledged']
    }
  });
};

const countDoctorUnreadNotifications = async (doctorUserId) => {
  return Notification.count({
    where: { recipientId: doctorUserId, isRead: false }
  });
};

const findRecentPatientActivity = async (patientIds, limit = 5) => {
  if (!patientIds || patientIds.length === 0) return [];
  return VitalsLog.findAll({
    where: {
      patientId: { [Op.in]: patientIds }
    },
    limit,
    order: [['logged_at', 'DESC']],
    include: [{ model: Patient, as: 'patient' }]
  });
};

// ==========================================
// ADMIN QUERIES
// ==========================================

const countAllUsers = async () => {
  return User.count();
};

const countAllPatients = async () => {
  return Patient.count();
};

const countAllDoctors = async () => {
  return Doctor.count();
};

const countPendingDoctors = async () => {
  return Doctor.count({
    where: { isVerified: false }
  });
};

const countTodayAppointments = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return Appointment.count({
    where: {
      appointmentAt: { [Op.between]: [startOfToday, endOfToday] }
    }
  });
};

const countActiveAppointments = async () => {
  return Appointment.count({
    where: {
      status: ['Scheduled', 'Confirmed', 'Pending']
    }
  });
};

const countAllOpenAlerts = async () => {
  return VitalsAlert.count({
    where: {
      status: ['Open', 'Acknowledged']
    }
  });
};

const countAllPrescriptions = async () => {
  return Prescription.count();
};

const countAllNotifications = async () => {
  return Notification.count();
};

const countAllActivityLogs = async () => {
  return ActivityLog.count();
};

module.exports = {
  findPatientUpcomingAppointments,
  findPatientLatestVitals,
  countPatientUnreadNotifications,
  countPatientActivePrescriptions,
  countPatientActiveAlerts,
  findDoctorTodayAppointments,
  findDoctorUpcomingAppointments,
  getDoctorClinicalPatientIds,
  countDoctorActivePrescriptions,
  countDoctorOpenAlerts,
  countDoctorUnreadNotifications,
  findRecentPatientActivity,
  countAllUsers,
  countAllPatients,
  countAllDoctors,
  countPendingDoctors,
  countTodayAppointments,
  countActiveAppointments,
  countAllOpenAlerts,
  countAllPrescriptions,
  countAllNotifications,
  countAllActivityLogs
};
