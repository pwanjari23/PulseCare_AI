/**
 * PulseCare AI – Upload Controller
 */

const uploadService = require('../services/upload.service');
const { ApiResponse, ApiError } = require('#utils/apiResponse.js');

/** Shared metadata builder */
const getMetadata = (req) => ({
  ipAddress: req.ip || '127.0.0.1',
  userAgent: req.get('User-Agent') || 'Unknown',
  userRole:  req.user.role,
});

/** POST /upload/profile-image */
const uploadProfileImage = async (req, res, next) => {
  try {
    const result = await uploadService.uploadProfileImage(
      req.file,
      req.user.id,
      getMetadata(req)
    );
    res.status(201).json(new ApiResponse(201, result, 'Profile image uploaded successfully.'));
  } catch (err) {
    next(err);
  }
};

/** POST /upload/doctor-document */
const uploadDoctorDocument = async (req, res, next) => {
  try {
    const result = await uploadService.uploadDoctorDocument(
      req.file,
      req.user.id,
      getMetadata(req)
    );
    res.status(201).json(new ApiResponse(201, result, 'Doctor document uploaded successfully.'));
  } catch (err) {
    next(err);
  }
};

/** POST /upload/prescription */
const uploadPrescription = async (req, res, next) => {
  try {
    const result = await uploadService.uploadPrescription(
      req.file,
      req.user.id,
      getMetadata(req)
    );
    res.status(201).json(new ApiResponse(201, result, 'Prescription document uploaded successfully.'));
  } catch (err) {
    next(err);
  }
};

/** POST /upload/medical-report */
const uploadMedicalReport = async (req, res, next) => {
  try {
    const result = await uploadService.uploadMedicalReport(
      req.file,
      req.user.id,
      getMetadata(req)
    );
    res.status(201).json(new ApiResponse(201, result, 'Medical report uploaded successfully.'));
  } catch (err) {
    next(err);
  }
};

/** POST /upload/lab-report */
const uploadLabReport = async (req, res, next) => {
  try {
    const result = await uploadService.uploadLabReport(
      req.file,
      req.user.id,
      getMetadata(req)
    );
    res.status(201).json(new ApiResponse(201, result, 'Lab report uploaded successfully.'));
  } catch (err) {
    next(err);
  }
};

/** GET /upload/:uuid */
const getFile = async (req, res, next) => {
  try {
    const result = await uploadService.getFileById(
      req.params.uuid,
      req.user.id,
      req.user.role
    );
    res.status(200).json(new ApiResponse(200, result, 'File retrieved successfully.'));
  } catch (err) {
    next(err);
  }
};

/** GET /upload/my-files */
const getMyFiles = async (req, res, next) => {
  try {
    const category = req.query.category || null;
    const results = await uploadService.getUserFiles(req.user.id, category);
    res.status(200).json(new ApiResponse(200, results, 'Your uploaded files retrieved successfully.'));
  } catch (err) {
    next(err);
  }
};

/** DELETE /upload/:uuid */
const deleteFile = async (req, res, next) => {
  try {
    await uploadService.deleteUploadedFile(
      req.params.uuid,
      req.user.id,
      getMetadata(req)
    );
    res.status(200).json(new ApiResponse(200, null, 'File deleted successfully.'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadProfileImage,
  uploadDoctorDocument,
  uploadPrescription,
  uploadMedicalReport,
  uploadLabReport,
  getFile,
  getMyFiles,
  deleteFile,
};
