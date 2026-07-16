/**
 * PulseCare AI – Upload Validator
 *
 * Validates the uploaded file object against per-category rules:
 *   - File presence
 *   - Allowed MIME type
 *   - Allowed extension
 *   - Category-specific maximum file size
 *
 * This middleware runs AFTER Multer has parsed the multipart request,
 * so req.file is populated when this executes.
 */

const path = require('path');
const {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZES,
  FILE_CATEGORIES,
  CATEGORY_ALLOWED_ROLES,
} = require('../constants/upload.constants');
const { ApiError } = require('#utils/apiResponse.js');

/**
 * Validates the file against the given category's rules.
 *
 * @param {string} category - One of FILE_CATEGORIES values
 * @returns Express middleware
 */
const validateUpload = (category) => (req, res, next) => {
  // 1. Verify the category is supported
  if (!FILE_CATEGORIES[category]) {
    return next(new ApiError(400, `Invalid file category: ${category}`));
  }

  // 2. Role authorization per category
  const userRole = req.user && req.user.role;
  const allowedRoles = CATEGORY_ALLOWED_ROLES[category];
  if (!allowedRoles.includes(userRole)) {
    return next(
      new ApiError(
        403,
        `Your role (${userRole}) is not authorized to upload files in the '${category}' category.`
      )
    );
  }

  // 3. File presence check
  if (!req.file) {
    return next(new ApiError(400, 'No file uploaded. Please attach a file to the request.'));
  }

  const { mimetype, originalname, size } = req.file;

  // 4. MIME type check
  const allowedMimes = ALLOWED_MIME_TYPES[category];
  if (!allowedMimes.includes(mimetype)) {
    return next(
      new ApiError(
        400,
        `Invalid file type '${mimetype}'. Allowed types for ${category}: ${allowedMimes.join(', ')}`
      )
    );
  }

  // 5. Extension check (based on original filename — secondary guard)
  const ext = path.extname(originalname).replace('.', '').toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[category];
  if (!allowedExts.includes(ext)) {
    return next(
      new ApiError(
        400,
        `Invalid file extension '.${ext}'. Allowed extensions for ${category}: ${allowedExts.join(', ')}`
      )
    );
  }

  // 6. Size check per category
  const maxSize = MAX_FILE_SIZES[category];
  if (size > maxSize) {
    const maxMB = (maxSize / 1024 / 1024).toFixed(0);
    return next(
      new ApiError(400, `File size exceeds the ${maxMB} MB limit for ${category}.`)
    );
  }

  next();
};

module.exports = { validateUpload };
