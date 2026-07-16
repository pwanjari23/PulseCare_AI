const { sequelize, Appointment } = require('#models/index.js');
const prescriptionRepository = require('../repositories/prescription.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const notificationService = require('../../notification/services/notification.service');
const { toPrescriptionDto } = require('../dtos/prescription.dto');
const {
  PRESCRIPTION_CREATED,
  PRESCRIPTION_UPDATED
} = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');
const emailService = require('../../email/config/email');

/**
 * Maps incoming items array to PrescriptionItem DB fields.
 * Input uses `medicineName`; DB uses `medication_name` (mapped as `medicationName`).
 */
const mapItems = (items, prescriptionId) => {
  return items.map(item => ({
    prescriptionId,
    medicationName: item.medicineName,
    dosage: item.dosage,
    frequency: item.frequency,
    durationDays: item.durationDays,
    instructions: item.instructions || null
  }));
};

/**
 * Validates that the doctor has a legitimate clinical relationship with the patient.
 * Checks: Primary Doctor, Accepted DoctorRequest, or any Appointment.
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
 * Creates a new prescription for a patient by a verified doctor.
 */
const createPrescription = async (doctorUserId, data, metadata = {}) => {
  // 1. Load and verify doctor
  const doctor = await doctorRepository.findDoctorByUserId(doctorUserId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }
  if (!doctor.isVerified) {
    throw new ApiError(403, 'Your account is not yet verified to issue prescriptions.');
  }
  if (!doctor.user || doctor.user.status !== 'Active') {
    throw new ApiError(403, 'Your account is not active.');
  }

  // 2. Load and verify patient
  const patient = await patientRepository.findPatientByUserId(data.patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found.');
  }

  // 3. Validate clinical relationship
  const hasRelationship = await validateClinicalRelationship(patient.id, doctor.id);
  if (!hasRelationship) {
    logger.warn(`Doctor ID ${doctor.id} attempted to prescribe for unrelated Patient ID ${patient.id}.`);
    throw new ApiError(403, 'You do not have a clinical relationship with this patient.');
  }

  // 4. Validate appointment if provided
  if (data.appointmentId) {
    const appt = await Appointment.findOne({ where: { id: data.appointmentId } });
    if (!appt) {
      throw new ApiError(400, 'The specified appointment does not exist.');
    }
    if (appt.doctorId !== doctor.id || appt.patientId !== patient.id) {
      throw new ApiError(400, 'The appointment does not belong to this doctor-patient pair.');
    }
    if (appt.status !== 'Completed') {
      throw new ApiError(400, 'Prescriptions can only be linked to Completed appointments.');
    }
  }

  // 5. Begin transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 6. Create prescription record
    const prescription = await prescriptionRepository.createPrescription({
      doctorId: doctor.id,
      patientId: patient.id,
      appointmentId: data.appointmentId || null,
      diagnosis: data.diagnosis,
      clinicalNotes: data.notes || null,
      followUpDate: data.followUpDate || null,
      status: 'Active'
    }, transaction);

    // 7. Bulk-create prescription items
    const itemRows = mapItems(data.items, prescription.id);
    await prescriptionRepository.createPrescriptionItems(itemRows, transaction);

    // 8. Audit log
    await authRepository.insertActivityLog({
      userId: doctor.id,
      action: PRESCRIPTION_CREATED,
      module: 'Prescription Management',
      entity: 'Prescription',
      entityId: prescription.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // 9. Commit
    await transaction.commit();
    transactionFinished = true;

    // 10. Patient notification (outside transaction — non-critical)
    try {
      await notificationService.createNotification({
        recipientId: patient.id,
        title: 'New Prescription',
        message: `Dr. ${doctor.firstName} ${doctor.lastName} has issued a new prescription for you.`,
        type: 'Prescription',
        payload: { prescriptionId: prescription.id, doctorId: doctor.id }
      }, null);
    } catch (notifErr) {
      logger.warn(`Prescription notification failed for patient ${patient.id}: ${notifErr.message}`);
    }

    // 11. Return refreshed DTO
    const full = await prescriptionRepository.findPrescriptionById(prescription.id);

    // Send email notification (non-blocking)
    if (full && full.patient && full.patient.user && full.patient.user.email) {
      emailService.sendPrescriptionEmail(full.patient.user.email, {
        patientName: `${full.patient.firstName} ${full.patient.lastName}`,
        doctorName: `${full.doctor.firstName} ${full.doctor.lastName}`,
        prescriptionId: full.id,
        diagnosis: full.diagnosis,
        items: full.items
      }).catch((err) => {
        logger.error(`[PrescriptionService] Non-blocking prescription email dispatch failed: ${err.message}`);
      });
    }

    return toPrescriptionDto(full);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Create prescription transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Updates an existing prescription (doctor-owned only).
 * Replaces the full medicine list.
 */
const updatePrescription = async (doctorUserId, prescriptionId, data, metadata = {}) => {
  // 1. Load and verify doctor
  const doctor = await doctorRepository.findDoctorByUserId(doctorUserId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }
  if (!doctor.isVerified) {
    throw new ApiError(403, 'Your account is not yet verified.');
  }
  if (!doctor.user || doctor.user.status !== 'Active') {
    throw new ApiError(403, 'Your account is not active.');
  }

  // 2. Load prescription with ownership check
  const prescription = await prescriptionRepository.findDoctorPrescription(doctor.id, prescriptionId);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found.');
  }

  // 3. Validate appointment if being changed
  if (data.appointmentId !== undefined) {
    if (data.appointmentId !== null) {
      const appt = await Appointment.findOne({ where: { id: data.appointmentId } });
      if (!appt) {
        throw new ApiError(400, 'The specified appointment does not exist.');
      }
      if (appt.doctorId !== doctor.id || appt.patientId !== prescription.patientId) {
        throw new ApiError(400, 'The appointment does not belong to this doctor-patient pair.');
      }
      if (appt.status !== 'Completed') {
        throw new ApiError(400, 'Prescriptions can only be linked to Completed appointments.');
      }
    }
  }

  // 4. Begin transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 5. Build update payload (only defined fields)
    const updateData = {};
    if (data.diagnosis !== undefined) updateData.diagnosis = data.diagnosis;
    if (data.notes !== undefined) updateData.clinicalNotes = data.notes;
    if (data.followUpDate !== undefined) updateData.followUpDate = data.followUpDate;
    if (data.appointmentId !== undefined) updateData.appointmentId = data.appointmentId;

    if (Object.keys(updateData).length > 0) {
      await prescriptionRepository.updatePrescription(prescriptionId, updateData, transaction);
    }

    // 6. Replace items if provided
    if (data.items && data.items.length > 0) {
      await prescriptionRepository.deletePrescriptionItems(prescriptionId, transaction);
      const itemRows = mapItems(data.items, prescriptionId);
      await prescriptionRepository.createPrescriptionItems(itemRows, transaction);
    }

    // 7. Audit log
    await authRepository.insertActivityLog({
      userId: doctor.id,
      action: PRESCRIPTION_UPDATED,
      module: 'Prescription Management',
      entity: 'Prescription',
      entityId: prescriptionId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // 8. Commit
    await transaction.commit();
    transactionFinished = true;

    const refreshed = await prescriptionRepository.findPrescriptionById(prescriptionId);
    return toPrescriptionDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Update prescription transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves a single prescription with role-based access control.
 */
const getPrescription = async (userId, userRole, prescriptionId) => {
  if (userRole === 'Patient') {
    const prescription = await prescriptionRepository.findPrescriptionById(prescriptionId);
    if (!prescription) {
      throw new ApiError(404, 'Prescription not found.');
    }
    if (prescription.patientId !== userId) {
      throw new ApiError(403, 'You are not authorized to view this prescription.');
    }
    return toPrescriptionDto(prescription);
  }

  if (userRole === 'Doctor') {
    const doctor = await doctorRepository.findDoctorByUserId(userId);
    if (!doctor) throw new ApiError(404, 'Doctor profile not found.');

    const prescription = await prescriptionRepository.findDoctorPrescription(doctor.id, prescriptionId);
    if (!prescription) {
      throw new ApiError(404, 'Prescription not found.');
    }
    return toPrescriptionDto(prescription);
  }

  // Admin — full access
  const prescription = await prescriptionRepository.findPrescriptionById(prescriptionId);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found.');
  }
  return toPrescriptionDto(prescription);
};

/**
 * Retrieves all prescriptions issued by the authenticated doctor.
 */
const getDoctorPrescriptions = async (doctorUserId) => {
  const doctor = await doctorRepository.findDoctorByUserId(doctorUserId);
  if (!doctor) throw new ApiError(404, 'Doctor profile not found.');

  const records = await prescriptionRepository.findDoctorPrescriptions(doctor.id);
  return records.map(toPrescriptionDto);
};

/**
 * Retrieves all prescriptions for the authenticated patient.
 */
const getPatientPrescriptions = async (patientUserId) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) throw new ApiError(404, 'Patient profile not found.');

  const records = await prescriptionRepository.findPatientPrescriptions(patient.id);
  return records.map(toPrescriptionDto);
};

module.exports = {
  createPrescription,
  updatePrescription,
  getPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions
};
