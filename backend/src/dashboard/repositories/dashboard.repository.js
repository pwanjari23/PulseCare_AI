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
  Specialization,
  DoctorAvailability,
  DoctorNote,
  PatientHealthSummary
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

const findDoctorOpenAlertsList = async (doctorId, limit = 5) => {
  return VitalsAlert.findAll({
    where: {
      doctorId,
      status: ['Open', 'Acknowledged']
    },
    limit,
    order: [['createdAt', 'DESC']],
    include: [
      { model: Patient, as: 'patient' },
      { model: VitalsLog, as: 'vitalsLog' }
    ]
  });
};

const findDoctorAvailabilityBlocks = async (doctorId) => {
  return DoctorAvailability.findAll({
    where: { doctorId, isAvailable: true }
  });
};

const findDoctorRecentPatients = async (doctorId, patientIds, limit = 5) => {
  if (!patientIds || patientIds.length === 0) return [];
  return Patient.findAll({
    where: {
      id: { [Op.in]: patientIds }
    },
    limit,
    include: [
      { model: User, as: 'user', attributes: ['status'] },
      { 
        model: Appointment, 
        as: 'appointments', 
        where: { doctorId }, 
        required: false,
        limit: 1,
        order: [['appointmentAt', 'DESC']]
      }
    ]
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

const countAllHealthSummaries = async () => {
  return PatientHealthSummary.count();
};

const findRecentActivityLogs = async (limit = 10) => {
  return ActivityLog.findAll({
    limit,
    order: [['created_at', 'DESC']]
  });
};

const findAllUpcomingAppointments = async (limit = 5) => {
  return Appointment.findAll({
    where: {
      appointmentAt: { [Op.gt]: new Date() }
    },
    limit,
    order: [['appointment_at', 'ASC']],
    include: [
      { model: Patient, as: 'patient' },
      { model: Doctor, as: 'doctor', include: [{ model: Specialization, as: 'specialization' }] }
    ]
  });
};

const findTopDoctors = async (limit = 5) => {
  const doctors = await Doctor.findAll({
    limit,
    include: [
      { model: User, as: 'user' },
      { model: Specialization, as: 'specialization' }
    ]
  });

  const doctorsWithStats = await Promise.all(doctors.map(async (doc) => {
    const appointmentsCount = await Appointment.count({ where: { doctorId: doc.id } });
    
    const patientIds = new Set();
    const primaryDocPatients = await Patient.findAll({
      attributes: ['id'],
      where: { primaryDoctorId: doc.id }
    });
    primaryDocPatients.forEach(p => patientIds.add(Number(p.id)));

    const appointments = await Appointment.findAll({
      attributes: ['patientId'],
      where: { doctorId: doc.id }
    });
    appointments.forEach(a => patientIds.add(Number(a.patientId)));

    return {
      id: doc.id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      specialization: doc.specialization ? doc.specialization.name : 'General Practice',
      isVerified: doc.isVerified,
      appointments: appointmentsCount,
      patients: patientIds.size,
      rating: doc.ratingAvg || 4.8
    };
  }));

  return doctorsWithStats;
};

const findTopPatients = async (limit = 5) => {
  const patients = await Patient.findAll({
    limit,
    include: [
      { model: User, as: 'user' }
    ]
  });

  const patientsWithStats = await Promise.all(patients.map(async (pat) => {
    const appointmentsCount = await Appointment.count({ where: { patientId: pat.id } });
    const prescriptionsCount = await Prescription.count({ where: { patientId: pat.id } });
    const doctorNotesCount = await DoctorNote.count({ where: { patientId: pat.id } });
    const aiSummariesCount = await PatientHealthSummary.count({ where: { patientId: pat.id } });

    return {
      id: pat.id,
      firstName: pat.firstName,
      lastName: pat.lastName,
      appointments: appointmentsCount,
      prescriptions: prescriptionsCount,
      doctorNotes: doctorNotesCount,
      aiSummaries: aiSummariesCount,
      status: pat.user ? pat.user.status : 'Active'
    };
  }));

  return patientsWithStats;
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
  findDoctorOpenAlertsList,
  findDoctorAvailabilityBlocks,
  findDoctorRecentPatients,
  findAllUpcomingAppointments,
  findTopDoctors,
  findTopPatients,
  countAllUsers,
  countAllPatients,
  countAllDoctors,
  countPendingDoctors,
  countTodayAppointments,
  countActiveAppointments,
  countAllOpenAlerts,
  countAllPrescriptions,
  countAllNotifications,
  countAllActivityLogs,
  findRecentActivityLogs,
  countAllHealthSummaries
};
