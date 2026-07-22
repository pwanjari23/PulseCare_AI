const dashboardRepository = require('../repositories/dashboard.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const healthSummaryService = require('../../ai/services/health-summary.service');
const {
  toPatientDashboardDto,
  toDoctorDashboardDto,
  toAdminDashboardDto
} = require('../dtos/dashboard.dto');
const { ApiError } = require('#utils/apiResponse.js');

/**
 * Patient Dashboard Orchestration
 */
const getPatientDashboard = async (patientUserId) => {
  // 1. Fetch patient profile
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }

  // 2. Fetch dashboard elements in parallel
  const [
    upcomingAppointments,
    latestVitals,
    activeAlertsCount,
    activePrescriptionsCount,
    unreadNotificationsCount
  ] = await Promise.all([
    dashboardRepository.findPatientUpcomingAppointments(patient.id),
    dashboardRepository.findPatientLatestVitals(patient.id),
    dashboardRepository.countPatientActiveAlerts(patient.id),
    dashboardRepository.countPatientActivePrescriptions(patient.id),
    dashboardRepository.countPatientUnreadNotifications(patientUserId)
  ]);

  let healthRiskLevel = 'Low';
  try {
    const healthSummary = await healthSummaryService.getPatientSummary(patientUserId, 'Patient', patient.id);
    if (healthSummary) healthRiskLevel = healthSummary.riskLevel;
  } catch (err) {
    // Ignore error
  }

  return toPatientDashboardDto({
    upcomingAppointments,
    latestVitals,
    activeAlertsCount,
    activePrescriptionsCount,
    unreadNotificationsCount,
    profileCompletionPercentage: patient.profileCompletionPct || 0,
    healthRiskLevel
  });
};

/**
 * Doctor Dashboard Orchestration
 */
const getDoctorDashboard = async (doctorUserId) => {
  // 1. Fetch doctor profile
  const doctor = await doctorRepository.findDoctorByUserId(doctorUserId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }

  // 2. Fetch clinical patients to get recent activity
  const clinicalPatientIds = await dashboardRepository.getDoctorClinicalPatientIds(doctor.id);

  // 3. Fetch dashboard elements in parallel
  const [
    todayAppointments,
    upcomingAppointments,
    activePrescriptionsCount,
    openAlertsCount,
    unreadNotificationsCount,
    recentPatientActivity,
    vitalAlerts,
    recentPatients,
    availabilityBlocks
  ] = await Promise.all([
    dashboardRepository.findDoctorTodayAppointments(doctor.id),
    dashboardRepository.findDoctorUpcomingAppointments(doctor.id),
    dashboardRepository.countDoctorActivePrescriptions(doctor.id),
    dashboardRepository.countDoctorOpenAlerts(doctor.id),
    dashboardRepository.countDoctorUnreadNotifications(doctorUserId),
    dashboardRepository.findRecentPatientActivity(clinicalPatientIds, 5),
    dashboardRepository.findDoctorOpenAlertsList(doctor.id, 5),
    dashboardRepository.findDoctorRecentPatients(doctor.id, clinicalPatientIds, 5),
    dashboardRepository.findDoctorAvailabilityBlocks(doctor.id)
  ]);

  return toDoctorDashboardDto({
    todayAppointments,
    upcomingAppointments,
    totalAssignedPatients: clinicalPatientIds.length,
    activePrescriptionsCount,
    openAlertsCount,
    unreadNotificationsCount,
    recentPatientActivity,
    vitalAlerts,
    recentPatients,
    availabilityBlocks
  });
};

/**
 * Admin Dashboard Orchestration
 */
const getAdminDashboard = async () => {
  // Fetch admin stats in parallel
  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    pendingDoctorApprovals,
    todayAppointmentsCount,
    activeAppointmentsCount,
    openAlertsCount,
    totalPrescriptionsCount,
    totalNotificationsCount,
    totalHealthSummariesCount,
    upcomingAppointments,
    topDoctors,
    topPatients
  ] = await Promise.all([
    dashboardRepository.countAllUsers(),
    dashboardRepository.countAllPatients(),
    dashboardRepository.countAllDoctors(),
    dashboardRepository.countPendingDoctors(),
    dashboardRepository.countTodayAppointments(),
    dashboardRepository.countActiveAppointments(),
    dashboardRepository.countAllOpenAlerts(),
    dashboardRepository.countAllPrescriptions(),
    dashboardRepository.countAllNotifications(),
    dashboardRepository.countAllHealthSummaries(),
    dashboardRepository.findAllUpcomingAppointments(5),
    dashboardRepository.findTopDoctors(5),
    dashboardRepository.findTopPatients(5)
  ]);

  return toAdminDashboardDto({
    totalUsers,
    totalPatients,
    totalDoctors,
    pendingDoctorApprovals,
    todayAppointmentsCount,
    activeAppointmentsCount,
    openAlertsCount,
    totalPrescriptionsCount,
    totalNotificationsCount,
    totalHealthSummariesCount,
    upcomingAppointments,
    topDoctors,
    topPatients
  });
};

const getRecentActivity = async () => {
  const logs = await dashboardRepository.findRecentActivityLogs(10);
  return logs.map(log => {
    let type = 'PATIENT_REGISTERED';
    let title = 'Platform Event';
    let description = `${log.action} in module ${log.module}`;

    if (log.action === 'DOCTOR_APPROVED') {
      type = 'DOCTOR_APPROVED';
      title = 'Doctor Account Approved';
      description = `Doctor account #${log.entityId} was approved and verified`;
    } else if (log.action === 'DOCTOR_REJECTED') {
      type = 'APPOINTMENT_CANCELLED';
      title = 'Doctor Account Rejected';
      description = `Doctor account #${log.entityId} application was rejected`;
    } else if (log.action === 'PATIENT_REGISTERED') {
      type = 'PATIENT_REGISTERED';
      title = 'New Patient Registered';
      description = `New patient account registered successfully`;
    } else if (log.action === 'APPOINTMENT_CREATED') {
      type = 'APPOINTMENT_CREATED';
      title = 'Appointment Scheduled';
      description = `A new appointment has been scheduled`;
    } else if (log.action === 'PRESCRIPTION_ADDED') {
      type = 'PRESCRIPTION_ADDED';
      title = 'Prescription Issued';
      description = `Prescription written by medical staff`;
    } else if (log.action === 'AI_SUMMARY_GENERATED') {
      type = 'AI_SUMMARY_GENERATED';
      title = 'AI Summary Generated';
      description = `New health assessment generated`;
    }

    const seconds = Math.floor((new Date() - new Date(log.createdAt)) / 1000);
    let time = 'just now';
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) time = `${minutes}m ago`;
      else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) time = `${hours}h ago`;
        else time = new Date(log.createdAt).toLocaleDateString();
      }
    }

    return {
      id: Number(log.id),
      type,
      title,
      description,
      time
    };
  });
};

module.exports = {
  getPatientDashboard,
  getDoctorDashboard,
  getAdminDashboard,
  getRecentActivity
};
