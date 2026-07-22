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

const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatDoctorAvailability = (availabilities) => {
  if (!availabilities || availabilities.length === 0) return null;

  const daysAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activeDays = availabilities.map(a => daysAbbr[a.dayOfWeek]);
  const workingDays = activeDays.join(', ');

  const first = availabilities[0];
  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };
  const schedule = `${formatTime(first.startTime)} - ${formatTime(first.endTime)}`;

  return {
    workingDays,
    schedule,
    nextSlot: 'See schedule',
    status: 'Available'
  };
};

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
  recentPatientActivity,
  vitalAlerts,
  recentPatients,
  availabilityBlocks
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
    })),
    vitalAlerts: (vitalAlerts || []).map(alert => ({
      id: Number(alert.id),
      patientName: alert.patient ? `${alert.patient.firstName} ${alert.patient.lastName}` : 'Unknown Patient',
      alertType: alert.vitalsLog ? alert.vitalsLog.triageStatus : 'Telemetry Alert',
      heartRate: alert.vitalsLog ? alert.vitalsLog.heartRate : null,
      bp: alert.vitalsLog ? `${alert.vitalsLog.systolicBp}/${alert.vitalsLog.diastolicBp}` : null,
      severity: alert.alertType,
      recordedTime: new Date(alert.createdAt).toLocaleDateString()
    })),
    recentPatients: (recentPatients || []).map(p => {
      let lastVisit = 'N/A';
      if (p.appointments && p.appointments.length > 0) {
        lastVisit = new Date(p.appointments[0].appointmentAt).toLocaleDateString();
      }
      return {
        id: Number(p.id),
        firstName: p.firstName,
        lastName: p.lastName,
        age: calculateAge(p.dateOfBirth),
        lastVisit,
        status: p.user ? p.user.status : 'Active'
      };
    }),
    availability: formatDoctorAvailability(availabilityBlocks)
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
  totalHealthSummariesCount,
  upcomingAppointments,
  topDoctors,
  topPatients
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
    totalHealthSummariesCount: Number(totalHealthSummariesCount || 0),
    upcomingAppointments: (upcomingAppointments || []).map(appt => {
      const patientName = appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : `Patient #${appt.patientId}`;
      const doctorName = appt.doctor ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}` : `Doctor #${appt.doctorId}`;
      const time = new Date(appt.appointmentAt).toLocaleString();
      return {
        id: Number(appt.id),
        patientName,
        doctorName,
        time,
        type: appt.doctor?.specialization ? (appt.doctor.specialization.name || appt.doctor.specialization) : appt.reason,
        status: appt.status
      };
    }),
    topDoctors: (topDoctors || []).map(d => ({
      id: Number(d.id),
      firstName: d.firstName,
      lastName: d.lastName,
      specialization: d.specialization,
      appointments: Number(d.appointments || 0),
      patients: Number(d.patients || 0),
      rating: Number(d.rating || 4.8),
      isVerified: d.isVerified
    })),
    topPatients: (topPatients || []).map(p => ({
      id: Number(p.id),
      firstName: p.firstName,
      lastName: p.lastName,
      appointments: Number(p.appointments || 0),
      prescriptions: Number(p.prescriptions || 0),
      doctorNotes: Number(p.doctorNotes || 0),
      aiSummaries: Number(p.aiSummaries || 0),
      status: p.status
    }))
  };
}

module.exports = {
  toPatientDashboardDto,
  toDoctorDashboardDto,
  toAdminDashboardDto
};
