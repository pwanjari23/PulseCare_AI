const { sequelize, Appointment } = require('#models/index.js');
const doctorNoteRepository = require('../repositories/doctor-note.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const { toDoctorNoteDto } = require('../dtos/doctor-note.dto');
const {
  DOCTOR_NOTE_CREATED,
  DOCTOR_NOTE_UPDATED,
  DOCTOR_NOTE_ARCHIVED
} = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Validates that the doctor has a legitimate clinical relationship with the patient.
 */
const validateClinicalRelationship = async (patientId, doctorId) => {
  const isPrimary = await patientRepository.findPrimaryDoctor(patientId, doctorId);
  if (isPrimary) return true;

  const hasRequest = await patientRepository.findAcceptedDoctorRequest(patientId, doctorId);
  if (hasRequest) return true;

  const hasAppointment = await patientRepository.findAppointment(patientId, doctorId);
  return !!hasAppointment;
};

/**
 * Helper to get active, verified doctor profile.
 */
const getVerifiedDoctor = async (doctorUserId) => {
  const doctor = await doctorRepository.findDoctorByUserId(doctorUserId);
  if (!doctor) {
    throw new ApiError(403, 'Doctor profile not found.');
  }
  if (!doctor.isVerified) {
    throw new ApiError(403, 'Your doctor account is not verified.');
  }
  if (!doctor.user || doctor.user.status !== 'Active') {
    throw new ApiError(403, 'Your account is not active.');
  }
  return doctor;
};

/**
 * Creates a new doctor note.
 */
const createNote = async (doctorUserId, data, metadata = {}) => {
  // 1. Get and verify doctor
  const doctor = await getVerifiedDoctor(doctorUserId);

  // 2. Validate patient exists
  const patient = await patientRepository.findPatientById(data.patientId);
  if (!patient) {
    throw new ApiError(403, 'Patient does not exist.');
  }

  // 3. Validate relationship
  const hasRelationship = await validateClinicalRelationship(patient.id, doctor.id);
  if (!hasRelationship) {
    logger.warn(`Doctor ID ${doctor.id} attempted to create note for unrelated Patient ID ${patient.id}.`);
    throw new ApiError(403, 'You do not have a clinical relationship with this patient.');
  }

  // 4. Validate appointment if supplied
  if (data.appointmentId) {
    const appt = await Appointment.findOne({ where: { id: data.appointmentId } });
    if (!appt) {
      throw new ApiError(400, 'The specified appointment does not exist.');
    }
    if (appt.doctorId !== doctor.id || appt.patientId !== patient.id) {
      throw new ApiError(400, 'The appointment does not belong to this doctor-patient pair.');
    }
  }

  // 5. Begin transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    const note = await doctorNoteRepository.createNote({
      doctorId: doctor.id,
      patientId: patient.id,
      appointmentId: data.appointmentId || null,
      title: data.title,
      noteContent: data.note,
      isArchived: false
    }, transaction);

    // Audit log
    await authRepository.insertActivityLog({
      userId: doctor.id,
      action: DOCTOR_NOTE_CREATED,
      module: 'Doctor Notes',
      entity: 'DoctorNote',
      entityId: note.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    // Return sanitized DTO
    const refreshed = await doctorNoteRepository.findNoteById(note.id);
    return toDoctorNoteDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Create doctor note transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Updates an existing doctor note (creator only, if not archived).
 */
const updateNote = async (doctorUserId, noteId, data, metadata = {}) => {
  const doctor = await getVerifiedDoctor(doctorUserId);

  const note = await doctorNoteRepository.findNoteById(noteId);
  if (!note) {
    throw new ApiError(404, 'Doctor note not found.');
  }

  if (note.doctorId !== doctor.id) {
    throw new ApiError(403, 'You do not have permission to update this note.');
  }

  if (note.isArchived) {
    throw new ApiError(400, 'Cannot update an archived note.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.note !== undefined) updateData.noteContent = data.note;

    await doctorNoteRepository.updateNote(noteId, updateData, transaction);

    // Audit log
    await authRepository.insertActivityLog({
      userId: doctor.id,
      action: DOCTOR_NOTE_UPDATED,
      module: 'Doctor Notes',
      entity: 'DoctorNote',
      entityId: noteId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await doctorNoteRepository.findNoteById(noteId);
    return toDoctorNoteDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Update doctor note transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Archives an existing doctor note (creator only).
 */
const archiveNote = async (doctorUserId, noteId, metadata = {}) => {
  const doctor = await getVerifiedDoctor(doctorUserId);

  const note = await doctorNoteRepository.findNoteById(noteId);
  if (!note) {
    throw new ApiError(404, 'Doctor note not found.');
  }

  if (note.doctorId !== doctor.id) {
    throw new ApiError(403, 'You do not have permission to archive this note.');
  }

  if (note.isArchived) {
    throw new ApiError(400, 'Note is already archived.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await doctorNoteRepository.archiveNote(noteId, transaction);

    // Audit log
    await authRepository.insertActivityLog({
      userId: doctor.id,
      action: DOCTOR_NOTE_ARCHIVED,
      module: 'Doctor Notes',
      entity: 'DoctorNote',
      entityId: noteId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await doctorNoteRepository.findNoteById(noteId);
    return toDoctorNoteDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Archive doctor note transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Lists all own notes for a doctor (excluding archived ones).
 */
const getDoctorNotes = async (doctorUserId) => {
  const doctor = await getVerifiedDoctor(doctorUserId);
  const notes = await doctorNoteRepository.findDoctorNotes(doctor.id, false);
  return notes.map(toDoctorNoteDto);
};

/**
 * Retrieves a single note (creator doctor or admin only, patient forbidden).
 */
const getNote = async (userId, userRole, noteId) => {
  if (userRole === 'Patient') {
    throw new ApiError(403, 'Patients are not permitted to view doctor notes.');
  }

  if (userRole === 'Doctor') {
    const doctor = await getVerifiedDoctor(userId);
    const note = await doctorNoteRepository.findNoteById(noteId);
    if (!note) {
      throw new ApiError(404, 'Doctor note not found.');
    }
    if (note.doctorId !== doctor.id) {
      throw new ApiError(403, 'You do not have permission to view this note.');
    }
    return toDoctorNoteDto(note);
  }

  if (userRole === 'Admin') {
    const note = await doctorNoteRepository.findNoteById(noteId);
    if (!note) {
      throw new ApiError(404, 'Doctor note not found.');
    }
    return toDoctorNoteDto(note);
  }

  throw new ApiError(403, 'Unauthorized role.');
};

/**
 * Lists all patient notes for admin auditing.
 */
const getPatientNotesForAdmin = async (patientId) => {
  const notes = await doctorNoteRepository.findPatientNotesForAdmin(patientId);
  return notes.map(toDoctorNoteDto);
};

module.exports = {
  createNote,
  updateNote,
  archiveNote,
  getDoctorNotes,
  getNote,
  getPatientNotesForAdmin
};
