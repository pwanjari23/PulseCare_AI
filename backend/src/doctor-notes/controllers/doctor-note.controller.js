const { validationResult, matchedData } = require('express-validator');
const doctorNoteService = require('../services/doctor-note.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/**
 * Helper to check validation results.
 */
const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed.', errors.array());
  }
};

/**
 * POST /doctor-notes — Doctor creates a new note.
 */
const createNote = async (req, res, next) => {
  try {
    checkValidation(req);
    const data = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const dto = await doctorNoteService.createNote(req.user.id, data, { ipAddress, userAgent });
    return res.status(201).json(
      new ApiResponse(201, dto, 'Doctor note created successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /doctor-notes/:id — Doctor updates a note.
 */
const updateNote = async (req, res, next) => {
  try {
    checkValidation(req);
    const { id, ...data } = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const dto = await doctorNoteService.updateNote(req.user.id, id, data, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, dto, 'Doctor note updated successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /doctor-notes/:id/archive — Doctor archives a note.
 */
const archiveNote = async (req, res, next) => {
  try {
    checkValidation(req);
    const { id } = matchedData(req, { includeOptionals: true });
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const dto = await doctorNoteService.archiveNote(req.user.id, id, { ipAddress, userAgent });
    return res.status(200).json(
      new ApiResponse(200, dto, 'Doctor note archived successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /doctor-notes/me — Doctor retrieves all of their own notes (archived excluded).
 */
const getDoctorNotes = async (req, res, next) => {
  try {
    const list = await doctorNoteService.getDoctorNotes(req.user.id);
    return res.status(200).json(
      new ApiResponse(200, list, 'Doctor notes retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /doctor-notes/:id — Doctor or Admin retrieves a note.
 */
const getNote = async (req, res, next) => {
  try {
    checkValidation(req);
    const noteId = parseInt(req.params.id, 10);
    const dto = await doctorNoteService.getNote(req.user.id, req.user.role, noteId);
    return res.status(200).json(
      new ApiResponse(200, dto, 'Doctor note retrieved successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /doctor-notes/admin/patient/:patientId — Admin lists all notes of a patient.
 */
const getPatientNotesForAdmin = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId, 10);
    if (isNaN(patientId)) {
      throw new ApiError(400, 'Patient ID must be a positive integer.');
    }
    const list = await doctorNoteService.getPatientNotesForAdmin(patientId);
    return res.status(200).json(
      new ApiResponse(200, list, 'Patient notes retrieved by admin successfully.')
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNote,
  updateNote,
  archiveNote,
  getDoctorNotes,
  getNote,
  getPatientNotesForAdmin
};
