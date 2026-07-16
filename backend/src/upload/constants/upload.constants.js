/**
 * PulseCare AI – Upload Module Constants
 */

const FILE_CATEGORIES = Object.freeze({
  PROFILE_IMAGE:   'PROFILE_IMAGE',
  DOCTOR_DOCUMENT: 'DOCTOR_DOCUMENT',
  PRESCRIPTION:    'PRESCRIPTION',
  MEDICAL_REPORT:  'MEDICAL_REPORT',
  LAB_REPORT:      'LAB_REPORT',
});

/** Maximum file sizes per category (in bytes) */
const MAX_FILE_SIZES = Object.freeze({
  [FILE_CATEGORIES.PROFILE_IMAGE]:   5  * 1024 * 1024,  // 5 MB
  [FILE_CATEGORIES.DOCTOR_DOCUMENT]: 10 * 1024 * 1024,  // 10 MB
  [FILE_CATEGORIES.PRESCRIPTION]:    10 * 1024 * 1024,  // 10 MB
  [FILE_CATEGORIES.MEDICAL_REPORT]:  20 * 1024 * 1024,  // 20 MB
  [FILE_CATEGORIES.LAB_REPORT]:      20 * 1024 * 1024,  // 20 MB
});

/** Allowed mime types per category */
const ALLOWED_MIME_TYPES = Object.freeze({
  [FILE_CATEGORIES.PROFILE_IMAGE]:   ['image/jpeg', 'image/png', 'image/webp'],
  [FILE_CATEGORIES.DOCTOR_DOCUMENT]: ['application/pdf', 'image/jpeg', 'image/png'],
  [FILE_CATEGORIES.PRESCRIPTION]:    ['application/pdf', 'image/jpeg', 'image/png'],
  [FILE_CATEGORIES.MEDICAL_REPORT]:  ['application/pdf', 'image/jpeg', 'image/png'],
  [FILE_CATEGORIES.LAB_REPORT]:      ['application/pdf', 'image/jpeg', 'image/png'],
});

/** Allowed file extensions per category (without dot, lowercase) */
const ALLOWED_EXTENSIONS = Object.freeze({
  [FILE_CATEGORIES.PROFILE_IMAGE]:   ['jpg', 'jpeg', 'png', 'webp'],
  [FILE_CATEGORIES.DOCTOR_DOCUMENT]: ['pdf', 'jpg', 'jpeg', 'png'],
  [FILE_CATEGORIES.PRESCRIPTION]:    ['pdf', 'jpg', 'jpeg', 'png'],
  [FILE_CATEGORIES.MEDICAL_REPORT]:  ['pdf', 'jpg', 'jpeg', 'png'],
  [FILE_CATEGORIES.LAB_REPORT]:      ['pdf', 'jpg', 'jpeg', 'png'],
});

/**
 * Local storage subdirectory names by category.
 * Resolved relative to backend/uploads/.
 */
const UPLOAD_DIRECTORIES = Object.freeze({
  [FILE_CATEGORIES.PROFILE_IMAGE]:   'profile-images',
  [FILE_CATEGORIES.DOCTOR_DOCUMENT]: 'doctor-documents',
  [FILE_CATEGORIES.PRESCRIPTION]:    'prescriptions',
  [FILE_CATEGORIES.MEDICAL_REPORT]:  'medical-reports',
  [FILE_CATEGORIES.LAB_REPORT]:      'lab-reports',
});

/** Roles that are authorized to upload each category */
const CATEGORY_ALLOWED_ROLES = Object.freeze({
  [FILE_CATEGORIES.PROFILE_IMAGE]:   ['Patient', 'Doctor', 'Admin'],
  [FILE_CATEGORIES.DOCTOR_DOCUMENT]: ['Doctor'],
  [FILE_CATEGORIES.PRESCRIPTION]:    ['Doctor'],
  [FILE_CATEGORIES.MEDICAL_REPORT]:  ['Patient'],
  [FILE_CATEGORIES.LAB_REPORT]:      ['Patient'],
});

/** Global multer memory limit (largest allowed category size + headroom) */
const MULTER_MEMORY_LIMIT = 21 * 1024 * 1024; // 21 MB

const STORAGE_PROVIDERS = Object.freeze({
  LOCAL: 'local',
});

module.exports = {
  FILE_CATEGORIES,
  MAX_FILE_SIZES,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  UPLOAD_DIRECTORIES,
  CATEGORY_ALLOWED_ROLES,
  MULTER_MEMORY_LIMIT,
  STORAGE_PROVIDERS,
};
