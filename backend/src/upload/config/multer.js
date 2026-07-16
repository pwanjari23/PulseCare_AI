/**
 * PulseCare AI – Multer Configuration
 *
 * Uses memory storage so the raw file Buffer is available to the
 * StorageProvider. This keeps storage logic fully abstracted — Multer
 * does NOT write any files to disk.
 *
 * Limits are set to the maximum allowed across all categories (20 MB)
 * as an initial gate. Fine-grained per-category validation happens later
 * in upload.validator.js.
 */

const multer = require('multer');
const { MULTER_MEMORY_LIMIT } = require('../constants/upload.constants');
const { ApiError } = require('#utils/apiResponse.js');

/** Use memory storage — buffers are passed directly to the StorageProvider */
const storage = multer.memoryStorage();

/** Multer instance with global memory limit */
const upload = multer({
  storage,
  limits: {
    fileSize: MULTER_MEMORY_LIMIT,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    // Basic sanity: reject files with no mime type at all
    if (!file.mimetype) {
      return cb(new ApiError(400, 'File must have a valid MIME type.'));
    }
    cb(null, true);
  },
});

/**
 * Multer error handler middleware.
 * Converts Multer-specific errors into ApiError format so the centralized
 * error handler can return consistent JSON responses.
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, 'File exceeds the maximum allowed size.'));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError(400, 'Only one file may be uploaded at a time.'));
    }
    return next(new ApiError(400, `File upload error: ${err.message}`));
  }
  next(err);
};

module.exports = { upload, handleMulterError };
