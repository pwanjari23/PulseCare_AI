/**
 * PulseCare AI – Upload DTO
 *
 * Sanitizes UploadedFile model instances before returning to clients.
 * Never exposes internal storage_path, filesystem structure, or raw metadata.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/**
 * Maps an UploadedFile Sequelize instance → client-safe DTO.
 *
 * @param {object} file  - UploadedFile model instance
 * @returns {object}      - Sanitized upload response
 */
const toUploadDto = (file) => {
  if (!file) return null;

  const plain = file.toJSON ? file.toJSON() : file;

  return {
    id:          plain.uuid,
    category:    plain.category,
    fileName:    plain.originalName,
    mimeType:    plain.mimeType,
    sizeBytes:   Number(plain.sizeBytes),
    url:         buildPublicUrl(plain),
    uploadedAt:  plain.createdAt,
  };
};

/**
 * Generates a public-facing URL for accessing the file.
 * For local provider: /uploads/<dir>/<storedName>
 * For future cloud providers: return the cloud URL.
 */
const buildPublicUrl = (plain) => {
  if (plain.storageProvider === 'local') {
    // storagePath contains the relative path from backend/uploads root:
    // e.g. "profile-images/uuid.jpg"
    return `${BASE_URL}/uploads/${plain.storagePath}`;
  }
  // Future: cloud providers return CDN/signed URLs
  return plain.storagePath;
};

module.exports = { toUploadDto };
