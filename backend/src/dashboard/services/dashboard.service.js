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
    unreadNotificationsCount,
    healthSummary
  ] = await Promise.all([
    dashboardRepository.findPatientUpcomingAppointments(patient.id),
    dashboardRepository.findPatientLatestVitals(patient.id),
    dashboardRepository.countPatientActiveAlerts(patient.id),
    dashboardRepository.countPatientActivePrescriptions(patient.id),
    dashboardRepository.countPatientUnreadNotifications(patientUserId),
    healthSummaryService.getPatientSummary(patientUserId, 'Patient', patient.id)
  ]);

  return toPatientDashboardDto({
    upcomingAppointments,
    latestVitals,
    activeAlertsCount,
    activePrescriptionsCount,
    unreadNotificationsCount,
    profileCompletionPercentage: patient.profileCompletionPct || 0,
    healthRiskLevel: healthSummary.riskLevel
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
    recentPatientActivity
  ] = await Promise.all([
    dashboardRepository.findDoctorTodayAppointments(doctor.id),
    dashboardRepository.findDoctorUpcomingAppointments(doctor.id),
    dashboardRepository.countDoctorActivePrescriptions(doctor.id),
    dashboardRepository.countDoctorOpenAlerts(doctor.id),
    dashboardRepository.countDoctorUnreadNotifications(doctorUserId),
    dashboardRepository.findRecentPatientActivity(clinicalPatientIds, 5)
  ]);

  return toDoctorDashboardDto({
    todayAppointments,
    upcomingAppointments,
    totalAssignedPatients: clinicalPatientIds.length,
    activePrescriptionsCount,
    openAlertsCount,
    unreadNotificationsCount,
    recentPatientActivity
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
    totalActivityLogsCount
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
    dashboardRepository.countAllActivityLogs()
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
    systemStats: {
      uptimeSeconds: process.uptime(),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      totalActivityLogsCount
    }
  });
};

module.exports = {
  getPatientDashboard,
  getDoctorDashboard,
  getAdminDashboard
};
