/**
 * Sanitizes a patient profile for the health summary.
 */
function sanitizePatient(patient) {
  if (!patient) return null;
  return {
    id: Number(patient.id),
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    bloodType: patient.bloodType,
    heightCm: patient.heightCm ? Number(patient.heightCm) : null,
    weightKg: patient.weightKg ? Number(patient.weightKg) : null,
    medicalConditions: patient.medicalConditions,
    allergies: patient.allergies,
    smokingStatus: patient.smokingStatus,
    alcoholConsumption: patient.alcoholConsumption
  };
}

/**
 * Sanitizes a vitals log record.
 */
function sanitizeVitals(vital) {
  if (!vital) return null;
  return {
    id: Number(vital.id),
    heartRate: vital.heartRate,
    systolicBp: vital.systolicBp,
    diastolicBp: vital.diastolicBp,
    oxygenLevel: vital.oxygenLevel ? Number(vital.oxygenLevel) : null,
    temperature: vital.temperature ? Number(vital.temperature) : null,
    weight: vital.weight ? Number(vital.weight) : null,
    loggedAt: vital.loggedAt,
    triageStatus: vital.triageStatus,
    respiratoryRate: vital.respiratoryRate,
    bloodGlucoseMgdl: vital.bloodGlucoseMgdl ? Number(vital.bloodGlucoseMgdl) : null,
    bloodGlucoseType: vital.bloodGlucoseType,
    painLevel: vital.painLevel,
    symptoms: vital.symptoms,
    mood: vital.mood,
    notes: vital.notes
  };
}

/**
 * Sanitizes an active alert record.
 */
function sanitizeAlert(alert) {
  if (!alert) return null;
  return {
    id: Number(alert.id),
    alertType: alert.alertType,
    status: alert.status,
    createdAt: alert.createdAt
  };
}

/**
 * Sanitizes an appointment record.
 */
function sanitizeAppointment(appt) {
  if (!appt) return null;
  return {
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
  };
}

/**
 * Sanitizes a prescription record.
 */
function sanitizePrescription(presc) {
  if (!presc) return null;
  return {
    id: Number(presc.id),
    prescribedAt: presc.prescribedAt,
    diagnosis: presc.diagnosis,
    status: presc.status,
    medicines: (presc.items || []).map(item => ({
      id: Number(item.id),
      medicineName: item.medicationName,
      dosage: item.dosage,
      frequency: item.frequency,
      durationDays: item.durationDays,
      instructions: item.instructions
    }))
  };
}

/**
 * Sanitizes a doctor note record.
 */
function sanitizeDoctorNote(note) {
  if (!note) return null;
  return {
    id: Number(note.id),
    title: note.title,
    note: note.noteContent,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    doctor: note.doctor ? {
      id: Number(note.doctor.id),
      firstName: note.doctor.firstName,
      lastName: note.doctor.lastName
    } : null
  };
}

/**
 * Maps the complete health summary data to a clean response DTO.
 */
function toHealthSummaryDto({
  patient,
  latestVitals,
  latestBMI,
  activeAlerts,
  recentAppointments,
  recentPrescriptions,
  recentDoctorNotes,
  riskLevel,
  riskFactors,
  recommendations
}) {
  return {
    patient: sanitizePatient(patient),
    latestVitals: sanitizeVitals(latestVitals),
    latestBMI,
    activeAlerts: (activeAlerts || []).map(sanitizeAlert),
    recentAppointments: (recentAppointments || []).map(sanitizeAppointment),
    recentPrescriptions: (recentPrescriptions || []).map(sanitizePrescription),
    recentDoctorNotes: recentDoctorNotes ? recentDoctorNotes.map(sanitizeDoctorNote) : null,
    riskLevel,
    riskFactors: riskFactors || [],
    recommendations: recommendations || [],
    generatedAt: new Date()
  };
}

module.exports = {
  toHealthSummaryDto
};
