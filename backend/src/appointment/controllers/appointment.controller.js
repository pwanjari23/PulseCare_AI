const { validationResult, matchedData } = require('express-validator');
const appointmentService = require('../services/appointment.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Books a new appointment (Patient only).
 */
const bookAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const validatedData = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const appointment = await appointmentService.bookAppointment(req.user.id, validatedData, { ipAddress, userAgent });
    return res.status(201).json(
      new ApiResponse(201, appointment, 'Appointment booked successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Cancels an appointment (Patient, Doctor, Admin).
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const appointment = await appointmentService.cancelAppointment(req.user.id, req.user.role, appointmentId, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, appointment, 'Appointment cancelled successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Doctor completes appointment and saves notes.
 */
const completeAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }

  try {
    const { notes } = matchedData(req);
    const appointmentId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const appointment = await appointmentService.completeAppointment(req.user.id, appointmentId, notes, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, appointment, 'Appointment marked completed successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves list of appointments for the doctor.
 */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const list = await appointmentService.getDoctorAppointments(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctor schedule retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves list of appointments for the patient.
 */
const getPatientAppointments = async (req, res, next) => {
  try {
    const list = await appointmentService.getPatientAppointments(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Patient schedule retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves a single appointment by ID.
 */
const getAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await appointmentService.getAppointmentById(req.user.id, req.user.role, appointmentId);
    return res.status(200).json(
      new ApiResponse(200, appointment, 'Appointment details retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getAppointment
};
