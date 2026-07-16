/**
 * DTO Mapper for Patient Dashboard
 */
function toPatientDashboardDto({
  upcomingAppointments,
  latestVitals,
  activeAlertsCount,
  activePrescriptionsCount,
  unreadNotificationsCount,
  profileCompletionPercentage,
  healthRiskLevel
}) {
  return {
    upcomingAppointments: (upcomingAppointments || []).map(appt => ({
      id: Number(appt.id),
      appointmentAt: appt.appointmentAt,
      status: appt.status,
      reason: appt.reason,
      doctor: appt.doctor ? {
        id: Number(appt.doctor.id),
        firstName: appt.doctor.firstName,
        lastName: appt.doctor.lastName,
        specialization: appt.doctor.specialization ? appt.doctor.specialization.name : null
      } : null
    })),
    latestVitals: latestVitals ? {
      id: Number(latestVitals.id),
      heartRate: latestVitals.heartRate,
      systolicBp: latestVitals.systolicBp,
      diastolicBp: latestVitals.diastolicBp,
      oxygenLevel: latestVitals.oxygenLevel ? Number(latestVitals.oxygenLevel) : null,
      temperature: latestVitals.temperature ? Number(latestVitals.temperature) : null,
      weight: latestVitals.weight ? Number(latestVitals.weight) : null,
      loggedAt: latestVitals.loggedAt,
      triageStatus: latestVitals.triageStatus
    } : null,
    activeAlertsCount: Number(activeAlertsCount || 0),
    activePrescriptionsCount: Number(activePrescriptionsCount || 0),
    unreadNotificationsCount: Number(unreadNotificationsCount || 0),
    profileCompletionPercentage: Number(profileCompletionPercentage || 0),
    healthRiskLevel
  };
}

/**
 * DTO Mapper for Doctor Dashboard
 */
function toDoctorDashboardDto({
  todayAppointments,
  upcomingAppointments,
  totalAssignedPatients,
  activePrescriptionsCount,
  openAlertsCount,
  unreadNotificationsCount,
  recentPatientActivity
}) {
  return {
    todayAppointments: (todayAppointments || []).map(appt => ({
      id: Number(appt.id),
      appointmentAt: appt.appointmentAt,
      status: appt.status,
      reason: appt.reason,
      patient: appt.patient ? {
        id: Number(appt.patient.id),
        firstName: appt.patient.firstName,
        lastName: appt.patient.lastName
      } : null
    })),
    upcomingAppointments: (upcomingAppointments || []).map(appt => ({
      id: Number(appt.id),
      appointmentAt: appt.appointmentAt,
      status: appt.status,
      reason: appt.reason,
      patient: appt.patient ? {
        id: Number(appt.patient.id),
        firstName: appt.patient.firstName,
        lastName: appt.patient.lastName
      } : null
    })),
    totalAssignedPatients: Number(totalAssignedPatients || 0),
    activePrescriptionsCount: Number(activePrescriptionsCount || 0),
    openAlertsCount: Number(openAlertsCount || 0),
    unreadNotificationsCount: Number(unreadNotificationsCount || 0),
    recentPatientActivity: (recentPatientActivity || []).map(act => ({
      id: Number(act.id),
      loggedAt: act.loggedAt,
      heartRate: act.heartRate,
      systolicBp: act.systolicBp,
      diastolicBp: act.diastolicBp,
      oxygenLevel: act.oxygenLevel ? Number(act.oxygenLevel) : null,
      temperature: act.temperature ? Number(act.temperature) : null,
      triageStatus: act.triageStatus,
      patient: act.patient ? {
        id: Number(act.patient.id),
        firstName: act.patient.firstName,
        lastName: act.patient.lastName
      } : null
    }))
  };
}

/**
 * DTO Mapper for Admin Dashboard
 */
function toAdminDashboardDto({
  totalUsers,
  totalPatients,
  totalDoctors,
  pendingDoctorApprovals,
  todayAppointmentsCount,
  activeAppointmentsCount,
  openAlertsCount,
  totalPrescriptionsCount,
  totalNotificationsCount,
  systemStats
}) {
  return {
    totalUsers: Number(totalUsers || 0),
    totalPatients: Number(totalPatients || 0),
    totalDoctors: Number(totalDoctors || 0),
    pendingDoctorApprovals: Number(pendingDoctorApprovals || 0),
    todayAppointmentsCount: Number(todayAppointmentsCount || 0),
    activeAppointmentsCount: Number(activeAppointmentsCount || 0),
    openAlertsCount: Number(openAlertsCount || 0),
    totalPrescriptionsCount: Number(totalPrescriptionsCount || 0),
    totalNotificationsCount: Number(totalNotificationsCount || 0),
    systemStats: {
      uptimeSeconds: Number(systemStats.uptimeSeconds),
      memoryUsageMB: Number(systemStats.memoryUsageMB),
      totalActivityLogsCount: Number(systemStats.totalActivityLogsCount || 0)
    }
  };
}

module.exports = {
  toPatientDashboardDto,
  toDoctorDashboardDto,
  toAdminDashboardDto
};
