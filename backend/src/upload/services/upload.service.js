/**
 * PulseCare AI – Upload Service
 *
 * Orchestrates the full upload lifecycle:
 *   1. Authorize the caller for the target category
 *   2. Validate file (mime, extension, size)  — done by middleware before reaching here
 *   3. Save the file via the StorageProvider
 *   4. Persist metadata in the database (with transaction)
 *   5. If DB write fails → delete orphan physical file
 *   6. Return sanitized DTO
 *
 * For PROFILE_IMAGE: automatically replaces any existing image for the same user.
 */

const path = require('path');
const { sequelize } = require('#models/index.js');
const uploadRepository = require('../repositories/upload.repository');
const storageProvider = require('../storage/local-storage.provider');
const { toUploadDto } = require('../dtos/upload.dto');
const { FILE_CATEGORIES } = require('../constants/upload.constants');
const {
  FILE_UPLOADED,
  FILE_DELETED,
  FILE_REPLACED,
} = require('#constants/activity.constants.js');
const authRepository = require('../../auth/repositories/auth.repository');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Extracts extension from original filename.
 */
const getExtension = (originalName) =>
  path.extname(originalName).replace('.', '').toLowerCase() || 'bin';

/**
 * Core upload logic (shared by all upload handlers).
 * Saves file to storage, then persists metadata in DB.
 * On DB failure, deletes the orphan physical file.
 *
 * @param {object}  file      - Multer file object (from req.file)
 * @param {string}  category  - FILE_CATEGORIES value
 * @param {number}  userId    - Authenticated user's ID
 * @param {object}  [metadata]- IP/UA for audit logging
 * @returns {object}           - toUploadDto result
 */
const performUpload = async (file, category, userId, metadata = {}) => {
  let savedStoragePath = null;
  let transactionFinished = false;
  const transaction = await sequelize.transaction();

  try {
    // 1. Save physical file via storage provider
    const { storedName, storagePath, storageProvider: providerName } = await storageProvider.save(
      file.buffer,
      file.originalname,
      file.mimetype,
      category
    );
    savedStoragePath = storagePath;

    // 2. Persist metadata
    const record = await uploadRepository.createFile(
      {
        originalName:    file.originalname,
        storedName,
        mimeType:        file.mimetype,
        extension:       getExtension(file.originalname),
        sizeBytes:       file.size,
        category,
        storageProvider: providerName,
        storagePath,
        uploadedBy:      userId,
      },
      transaction
    );

    // 3. Audit log
    await authRepository.insertActivityLog(
      {
        userId,
        action:    FILE_UPLOADED,
        module:    'Upload',
        entity:    'UploadedFile',
        entityId:  record.id,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date(),
      },
      transaction
    );

    await transaction.commit();
    transactionFinished = true;

    // 4. Return DTO
    const refreshed = await uploadRepository.findById(record.id);
    return toUploadDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      await transaction.rollback();
      // Rollback: delete orphan physical file
      if (savedStoragePath) {
        storageProvider.delete(savedStoragePath).catch((delErr) => {
          logger.error(`[Upload] Orphan file cleanup failed: ${delErr.message}`);
        });
        logger.warn(`[Upload] Rolled back DB transaction; orphan file deleted: ${savedStoragePath}`);
      }
    }
    throw error;
  }
};

/**
 * Uploads a profile image.
 * If the user already has a profile image, it is replaced atomically.
 */
const uploadProfileImage = async (file, userId, metadata = {}) => {
  const category = FILE_CATEGORIES.PROFILE_IMAGE;

  // Check if user already has a profile image
  const existing = await uploadRepository.findLatestUserFileByCategory(userId, category);

  if (existing) {
    return replaceUploadedFile(existing.uuid, file, userId, metadata);
  }

  return performUpload(file, category, userId, metadata);
};

/** Uploads a doctor document */
const uploadDoctorDocument = async (file, userId, metadata = {}) => {
  return performUpload(file, FILE_CATEGORIES.DOCTOR_DOCUMENT, userId, metadata);
};

/** Uploads a prescription document */
const uploadPrescription = async (file, userId, metadata = {}) => {
  return performUpload(file, FILE_CATEGORIES.PRESCRIPTION, userId, metadata);
};

/** Uploads a medical report */
const uploadMedicalReport = async (file, userId, metadata = {}) => {
  return performUpload(file, FILE_CATEGORIES.MEDICAL_REPORT, userId, metadata);
};

/** Uploads a lab report */
const uploadLabReport = async (file, userId, metadata = {}) => {
  return performUpload(file, FILE_CATEGORIES.LAB_REPORT, userId, metadata);
};

/**
 * Replaces an existing uploaded file.
 * - Saves new physical file.
 * - Updates DB metadata.
 * - Deletes old physical file.
 *
 * @param {string}  fileUuid - Public UUID of the existing file
 * @param {object}  newFile  - Multer file object
 * @param {number}  userId   - Requesting user ID
 * @param {object}  [metadata]
 * @returns {object} - DTO of the updated file
 */
const replaceUploadedFile = async (fileUuid, newFile, userId, metadata = {}) => {
  const existing = await uploadRepository.findByUuid(fileUuid);
  if (!existing) {
    throw new ApiError(404, 'File not found.');
  }

  // Authorization: owner or admin
  const userRole = metadata.userRole;
  if (existing.uploadedBy !== userId && userRole !== 'Admin') {
    throw new ApiError(403, 'You do not have permission to replace this file.');
  }

  const oldStoragePath = existing.storagePath;
  let newStoragePath = null;
  let transactionFinished = false;
  const transaction = await sequelize.transaction();

  try {
    // Save new file
    const { storedName, storagePath, storageProvider: providerName } = await storageProvider.save(
      newFile.buffer,
      newFile.originalname,
      newFile.mimetype,
      existing.category
    );
    newStoragePath = storagePath;

    // Update DB metadata
    await uploadRepository.updateFile(
      existing.id,
      {
        originalName:    newFile.originalname,
        storedName,
        mimeType:        newFile.mimetype,
        extension:       getExtension(newFile.originalname),
        sizeBytes:       newFile.size,
        storageProvider: providerName,
        storagePath,
      },
      transaction
    );

    // Audit log
    await authRepository.insertActivityLog(
      {
        userId,
        action:    FILE_REPLACED,
        module:    'Upload',
        entity:    'UploadedFile',
        entityId:  existing.id,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date(),
      },
      transaction
    );

    await transaction.commit();
    transactionFinished = true;

    // Delete old physical file after DB commit
    storageProvider.delete(oldStoragePath).catch((err) => {
      logger.warn(`[Upload] Old file cleanup failed after replace: ${err.message}`);
    });

    const refreshed = await uploadRepository.findById(existing.id);
    return toUploadDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      await transaction.rollback();
      // Cleanup newly written orphan
      if (newStoragePath) {
        storageProvider.delete(newStoragePath).catch((err) => {
          logger.error(`[Upload] Orphan new file cleanup failed after replace: ${err.message}`);
        });
      }
    }
    throw error;
  }
};

/**
 * Deletes an uploaded file (physical + DB record).
 * Only the owner or an Admin may delete.
 *
 * @param {string} fileUuid  - Public UUID of the file
 * @param {number} userId    - Requesting user's ID
 * @param {object} [metadata]
 */
const deleteUploadedFile = async (fileUuid, userId, metadata = {}) => {
  const existing = await uploadRepository.findByUuid(fileUuid);
  if (!existing) {
    throw new ApiError(404, 'File not found.');
  }

  const userRole = metadata.userRole;
  if (existing.uploadedBy !== userId && userRole !== 'Admin') {
    throw new ApiError(403, 'You do not have permission to delete this file.');
  }

  const storagePath = existing.storagePath;
  let transactionFinished = false;
  const transaction = await sequelize.transaction();

  try {
    await uploadRepository.deleteFile(existing.id, transaction);

    await authRepository.insertActivityLog(
      {
        userId,
        action:    FILE_DELETED,
        module:    'Upload',
        entity:    'UploadedFile',
        entityId:  existing.id,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date(),
      },
      transaction
    );

    await transaction.commit();
    transactionFinished = true;

    // Delete physical file after DB commit
    await storageProvider.delete(storagePath);

    return { deleted: true };
  } catch (error) {
    if (!transactionFinished) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves a single file record by UUID.
 * Admin can retrieve any file; others can only retrieve their own.
 */
const getFileById = async (fileUuid, userId, userRole) => {
  const file = await uploadRepository.findByUuid(fileUuid);
  if (!file) {
    throw new ApiError(404, 'File not found.');
  }
  if (file.uploadedBy !== userId && userRole !== 'Admin') {
    throw new ApiError(403, 'You do not have permission to view this file.');
  }
  return toUploadDto(file);
};

/**
 * Lists all files for the requesting user (optionally filtered by category).
 */
const getUserFiles = async (userId, category = null) => {
  const files = await uploadRepository.findUserFiles(userId, category);
  return files.map(toUploadDto);
};

module.exports = {
  uploadProfileImage,
  uploadDoctorDocument,
  uploadPrescription,
  uploadMedicalReport,
  uploadLabReport,
  replaceUploadedFile,
  deleteUploadedFile,
  getFileById,
  getUserFiles,
};
