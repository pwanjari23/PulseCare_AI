const { DoctorNote, Doctor, Patient, Appointment } = require('#models/index.js');

/**
 * Finds a note by primary key, including associations.
 */
const findNoteById = async (id, transaction) => {
  return DoctorNote.findByPk(id, {
    include: [
      { model: Doctor, as: 'doctor' },
      { model: Patient, as: 'patient' },
      { model: Appointment, as: 'appointment' }
    ],
    transaction
  });
};

/**
 * Finds a doctor note scoped to a specific doctor (ownership check).
 */
const findDoctorNote = async (doctorId, noteId, transaction) => {
  return DoctorNote.findOne({
    where: { id: noteId, doctorId },
    include: [
      { model: Doctor, as: 'doctor' },
      { model: Patient, as: 'patient' },
      { model: Appointment, as: 'appointment' }
    ],
    transaction
  });
};

/**
 * Finds all doctor notes for a specific doctor.
 */
const findDoctorNotes = async (doctorId, includeArchived = false, transaction) => {
  const where = { doctorId };
  if (!includeArchived) {
    where.isArchived = false;
  }
  return DoctorNote.findAll({
    where,
    order: [['created_at', 'DESC']],
    include: [
      { model: Doctor, as: 'doctor' },
      { model: Patient, as: 'patient' },
      { model: Appointment, as: 'appointment' }
    ],
    transaction
  });
};

/**
 * Finds all doctor notes for a patient for admin auditing.
 */
const findPatientNotesForAdmin = async (patientId, transaction) => {
  return DoctorNote.findAll({
    where: { patientId },
    order: [['created_at', 'DESC']],
    include: [
      { model: Doctor, as: 'doctor' },
      { model: Patient, as: 'patient' },
      { model: Appointment, as: 'appointment' }
    ],
    transaction
  });
};

/**
 * Creates a doctor note record.
 */
const createNote = async (data, transaction) => {
  return DoctorNote.create(data, { transaction });
};

/**
 * Updates a doctor note record.
 */
const updateNote = async (id, data, transaction) => {
  return DoctorNote.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Archives a doctor note.
 */
const archiveNote = async (id, transaction) => {
  return DoctorNote.update(
    { isArchived: true },
    {
      where: { id },
      transaction
    }
  );
};

module.exports = {
  findNoteById,
  findDoctorNote,
  findDoctorNotes,
  findPatientNotesForAdmin,
  createNote,
  updateNote,
  archiveNote
};
