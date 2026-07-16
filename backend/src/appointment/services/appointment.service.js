const { sequelize } = require('#models/index.js');
const appointmentRepository = require('../repositories/appointment.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const notificationService = require('../../notification/services/notification.service');
const { toAppointmentDto } = require('../dtos/appointment.dto');
const {
  APPOINTMENT_BOOKED,
  APPOINTMENT_CANCELLED,
  APPOINTMENT_COMPLETED
} = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');
const emailService = require('../../email/config/email');

/**
 * Patient books a new appointment.
 * @param {number|string} patientUserId - Patient User ID
 * @param {object} data - Booking parameters
 * @param {object} metadata - Metadata (IP, user agent)
 * @returns {Promise<object>} Sanitized DTO
 */
const bookAppointment = async (patientUserId, data, metadata = {}) => {
  // 1. Verify Patient exists
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    logger.warn(`Booking failed: Patient ID ${patientUserId} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  // 2. Verify Doctor exists
  const doctor = await doctorRepository.findDoctorWithSpecialization(data.doctorId);
  if (!doctor) {
    logger.warn(`Booking failed: Doctor ID ${data.doctorId} not found.`);
    throw new ApiError(404, 'Doctor profile not found.');
  }

  // Verify Doctor is Active (throws 403 Forbidden as per verification tests)
  if (!doctor.user || doctor.user.status !== 'Active') {
    logger.warn(`Booking failed: Doctor User ID ${data.doctorId} status is not Active.`);
    throw new ApiError(403, 'Doctor account is inactive.');
  }

  // Verify Doctor is Verified (throws 400 as per verification tests)
  if (!doctor.isVerified) {
    logger.warn(`Booking failed: Doctor ID ${data.doctorId} is not verified.`);
    throw new ApiError(400, 'Doctor is not verified.');
  }

  // 3. Verify scheduled time is in the future
  const scheduledTime = new Date(data.scheduledAt);
  if (scheduledTime <= new Date()) {
    logger.warn(`Booking failed: Date is in the past.`);
    throw new ApiError(400, 'Appointment scheduled date must be in the future.');
  }

  // 4. Validate duration (15-120 minutes)
  const duration = parseInt(data.durationMinutes) || 30;
  if (duration < 15 || duration > 120) {
    logger.warn(`Booking failed: Invalid duration ${duration}`);
    throw new ApiError(400, 'Duration must be between 15 and 120 minutes.');
  }

  // 5. Overlapping conflict check
  const overlap = await appointmentRepository.checkOverlappingAppointments(data.doctorId, data.scheduledAt, duration);
  if (overlap) {
    logger.warn(`Booking conflict: Doctor ID ${data.doctorId} is busy at ${data.scheduledAt}`);
    throw new ApiError(400, 'Doctor is unavailable for the selected time slot.');
  }

  // 6. Begin Transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    const appRecord = await appointmentRepository.createAppointment({
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentAt: data.scheduledAt,
      status: 'Scheduled',
      reason: data.reason || null,
      notes: data.notes || null,
      durationMinutes: duration,
      appointmentType: 'Online'
    }, transaction);

    // Record activity log
    await authRepository.insertActivityLog({
      userId: patient.id,
      action: APPOINTMENT_BOOKED,
      module: 'Appointment Management',
      entity: 'Appointment',
      entityId: appRecord.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // Create notifications for patient and doctor
    await notificationService.createManyNotifications([
      {
        recipientId: patient.id,
        title: 'Appointment Booked',
        message: `Your appointment with Dr. ${doctor.lastName} is scheduled.`,
        type: 'Appointment',
        payload: { appointmentId: appRecord.id, patientId: patient.id, doctorId: doctor.id }
      },
      {
        recipientId: doctor.id,
        title: 'New Appointment Booked',
        message: `Patient ${patient.firstName} ${patient.lastName} has booked an appointment.`,
        type: 'Appointment',
        payload: { appointmentId: appRecord.id, patientId: patient.id, doctorId: doctor.id }
      }
    ], transaction);

    await transaction.commit();
    transactionFinished = true;

    const completeApp = await appointmentRepository.findAppointmentById(appRecord.id);

    // Send emails (non-blocking)
    if (completeApp) {
      const patientName = `${completeApp.patient.firstName} ${completeApp.patient.lastName}`;
      const doctorName = `Dr. ${completeApp.doctor.firstName} ${completeApp.doctor.lastName}`;
      const time = new Date(completeApp.appointmentAt).toLocaleString();

      if (completeApp.patient.user && completeApp.patient.user.email) {
        emailService.sendAppointmentBookedEmail(completeApp.patient.user.email, {
          recipientName: patientName,
          otherPartyName: doctorName,
          dateTime: time,
          reason: completeApp.reason
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking patient booking email failed: ${err.message}`);
        });
      }
      if (completeApp.doctor.user && completeApp.doctor.user.email) {
        emailService.sendAppointmentBookedEmail(completeApp.doctor.user.email, {
          recipientName: doctorName,
          otherPartyName: patientName,
          dateTime: time,
          reason: completeApp.reason
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking doctor booking email failed: ${err.message}`);
        });
      }
    }

    return toAppointmentDto(completeApp);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Book appointment transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Cancels an appointment (Patient, Doctor, or Admin).
 */
const cancelAppointment = async (userId, userRole, appointmentId, metadata = {}) => {
  const app = await appointmentRepository.findAppointmentById(appointmentId);
  if (!app) {
    throw new ApiError(404, 'Appointment not found.');
  }

  // Authorization Checks
  if (userRole === 'Patient' && app.patientId !== userId) {
    logger.warn(`Patient User ID ${userId} attempted unauthorized cancel on Appointment ID ${appointmentId}`);
    throw new ApiError(403, 'You are not authorized to cancel this appointment.');
  }
  if (userRole === 'Doctor' && app.doctorId !== userId) {
    logger.warn(`Doctor User ID ${userId} attempted unauthorized cancel on Appointment ID ${appointmentId}`);
    throw new ApiError(403, 'You are not authorized to cancel this appointment.');
  }

  // State checks
  if (app.status === 'Cancelled') {
    throw new ApiError(400, 'Appointment is already cancelled.');
  }
  if (app.status === 'Completed') {
    throw new ApiError(400, 'Completed appointments cannot be cancelled.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await appointmentRepository.updateAppointment(appointmentId, { status: 'Cancelled' }, transaction);

    await authRepository.insertActivityLog({
      userId,
      action: APPOINTMENT_CANCELLED,
      module: 'Appointment Management',
      entity: 'Appointment',
      entityId: appointmentId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // Create notifications for patient and doctor
    await notificationService.createManyNotifications([
      {
        recipientId: app.patientId,
        title: 'Appointment Cancelled',
        message: `Your appointment scheduled for ${new Date(app.appointmentAt).toLocaleString()} has been cancelled.`,
        type: 'Appointment',
        payload: { appointmentId: app.id, patientId: app.patientId, doctorId: app.doctorId }
      },
      {
        recipientId: app.doctorId,
        title: 'Appointment Cancelled',
        message: `The appointment scheduled for ${new Date(app.appointmentAt).toLocaleString()} has been cancelled.`,
        type: 'Appointment',
        payload: { appointmentId: app.id, patientId: app.patientId, doctorId: app.doctorId }
      }
    ], transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await appointmentRepository.findAppointmentById(appointmentId);

    // Send emails (non-blocking)
    if (refreshed) {
      const patientName = `${refreshed.patient.firstName} ${refreshed.patient.lastName}`;
      const doctorName = `Dr. ${refreshed.doctor.firstName} ${refreshed.doctor.lastName}`;
      const time = new Date(refreshed.appointmentAt).toLocaleString();

      if (refreshed.patient.user && refreshed.patient.user.email) {
        emailService.sendAppointmentCancelledEmail(refreshed.patient.user.email, {
          recipientName: patientName,
          otherPartyName: doctorName,
          dateTime: time,
          cancelledBy: userRole
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking patient cancel email failed: ${err.message}`);
        });
      }
      if (refreshed.doctor.user && refreshed.doctor.user.email) {
        emailService.sendAppointmentCancelledEmail(refreshed.doctor.user.email, {
          recipientName: doctorName,
          otherPartyName: patientName,
          dateTime: time,
          cancelledBy: userRole
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking doctor cancel email failed: ${err.message}`);
        });
      }
    }

    return toAppointmentDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Cancel appointment transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Doctor completes appointment and saves notes.
 */
const completeAppointment = async (doctorUserId, appointmentId, notes, metadata = {}) => {
  const app = await appointmentRepository.findAppointmentById(appointmentId);
  if (!app) {
    throw new ApiError(404, 'Appointment not found.');
  }

  // Verify doctor ownership
  if (app.doctorId !== doctorUserId) {
    logger.warn(`Doctor User ID ${doctorUserId} attempted unauthorized complete on Appointment ID ${appointmentId}`);
    throw new ApiError(403, 'You are not authorized to complete this appointment.');
  }

  // Only Scheduled appointments can become Completed
  if (app.status !== 'Scheduled') {
    throw new ApiError(400, `Only Scheduled appointments can become Completed. Current status: ${app.status}`);
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await appointmentRepository.updateAppointment(appointmentId, {
      status: 'Completed',
      notes: notes || app.notes
    }, transaction);

    await authRepository.insertActivityLog({
      userId: doctorUserId,
      action: APPOINTMENT_COMPLETED,
      module: 'Appointment Management',
      entity: 'Appointment',
      entityId: appointmentId,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // Create notifications for patient and doctor
    await notificationService.createManyNotifications([
      {
        recipientId: app.patientId,
        title: 'Appointment Completed',
        message: `Your consultation with Dr. ${app.doctor ? app.doctor.lastName : 'Doctor'} is complete.`,
        type: 'Appointment',
        payload: { appointmentId: app.id, patientId: app.patientId, doctorId: app.doctorId }
      },
      {
        recipientId: app.doctorId,
        title: 'Appointment Completed',
        message: `You marked appointment ID ${app.id} as completed.`,
        type: 'Appointment',
        payload: { appointmentId: app.id, patientId: app.patientId, doctorId: app.doctorId }
      }
    ], transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await appointmentRepository.findAppointmentById(appointmentId);

    // Send emails (non-blocking)
    if (refreshed) {
      const patientName = `${refreshed.patient.firstName} ${refreshed.patient.lastName}`;
      const doctorName = `Dr. ${refreshed.doctor.firstName} ${refreshed.doctor.lastName}`;
      const time = new Date(refreshed.appointmentAt).toLocaleString();

      if (refreshed.patient.user && refreshed.patient.user.email) {
        emailService.sendAppointmentCompletedEmail(refreshed.patient.user.email, {
          recipientName: patientName,
          otherPartyName: doctorName,
          dateTime: time
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking patient complete email failed: ${err.message}`);
        });
      }
      if (refreshed.doctor.user && refreshed.doctor.user.email) {
        emailService.sendAppointmentCompletedEmail(refreshed.doctor.user.email, {
          recipientName: doctorName,
          otherPartyName: patientName,
          dateTime: time
        }).catch((err) => {
          logger.error(`[AppointmentService] Non-blocking doctor complete email failed: ${err.message}`);
        });
      }
    }

    return toAppointmentDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Complete appointment transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves appointments for the doctor.
 */
const getDoctorAppointments = async (doctorUserId) => {
  const doctor = await doctorRepository.findDoctorById(doctorUserId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }
  const list = await appointmentRepository.findDoctorAppointments(doctor.id);
  return list.map(toAppointmentDto);
};

/**
 * Retrieves appointments for the patient.
 */
const getPatientAppointments = async (patientUserId) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }
  const list = await appointmentRepository.findPatientAppointments(patient.id);
  return list.map(toAppointmentDto);
};

/**
 * Retrieves a single appointment with privacy restrictions.
 */
const getAppointmentById = async (userId, userRole, appointmentId) => {
  const app = await appointmentRepository.findAppointmentById(appointmentId);
  if (!app) {
    throw new ApiError(404, 'Appointment not found.');
  }

  // Security checks: Patient (own only), Doctor (own only), Admin (all)
  if (userRole === 'Patient' && app.patientId !== userId) {
    logger.warn(`Patient User ID ${userId} unauthorized lookup attempt for Appointment ID ${appointmentId}`);
    throw new ApiError(403, 'You are not authorized to view this appointment.');
  }
  if (userRole === 'Doctor' && app.doctorId !== userId) {
    logger.warn(`Doctor User ID ${userId} unauthorized lookup attempt for Appointment ID ${appointmentId}`);
    throw new ApiError(403, 'You are not authorized to view this appointment.');
  }

  return toAppointmentDto(app);
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getAppointmentById
};
