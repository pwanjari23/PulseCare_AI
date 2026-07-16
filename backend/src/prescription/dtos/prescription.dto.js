/**
 * Maps a PrescriptionItem Sequelize instance to a sanitized medicine DTO.
 * @param {object} item - PrescriptionItem instance or plain object
 * @returns {object} Medicine DTO
 */
const toMedicineDto = (item) => {
  const d = typeof item.toJSON === 'function' ? item.toJSON() : item;
  return {
    id: d.id,
    medicineName: d.medicationName,
    dosage: d.dosage,
    frequency: d.frequency,
    durationDays: d.durationDays,
    instructions: d.instructions || null
  };
};

/**
 * Maps a Prescription Sequelize instance (with associations) to a sanitized client DTO.
 * @param {object} record - Prescription instance with doctor, patient, items associations
 * @returns {object|null} Sanitized prescription DTO
 */
const toPrescriptionDto = (record) => {
  if (!record) return null;

  const d = typeof record.toJSON === 'function' ? record.toJSON() : record;

  const doctor = d.doctor || {};
  const patient = d.patient || {};

  return {
    id: d.id,
    appointmentId: d.appointmentId || null,
    diagnosis: d.diagnosis || null,
    notes: d.clinicalNotes || null,
    status: d.status,
    prescribedAt: d.prescribedAt || d.prescribed_at || null,
    followUpDate: d.followUpDate || null,
    doctor: {
      id: doctor.id || null,
      firstName: doctor.firstName || null,
      lastName: doctor.lastName || null,
      specialization: doctor.specialization
        ? { id: doctor.specialization.id, name: doctor.specialization.name }
        : null
    },
    patient: {
      id: patient.id || null,
      firstName: patient.firstName || null,
      lastName: patient.lastName || null
    },
    medicines: Array.isArray(d.items) ? d.items.map(toMedicineDto) : []
  };
};

module.exports = {
  toPrescriptionDto
};
