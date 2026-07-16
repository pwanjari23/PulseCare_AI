/**
 * PulseCare AI – Storage Provider Interface
 *
 * Every concrete storage implementation (local, S3, Cloudinary, Azure, GCS)
 * must implement this interface. The business layer (Service) only ever calls
 * these four methods — never filesystem or SDK APIs directly.
 */

class StorageProviderInterface {
  /**
   * Saves a file to storage.
   *
   * @param {Buffer}  buffer        - Raw file buffer (from Multer memory storage)
   * @param {string}  originalName  - Original filename (user-supplied, already sanitized)
   * @param {string}  mimeType      - Validated MIME type
   * @param {string}  category      - FILE_CATEGORIES value (e.g. 'PROFILE_IMAGE')
   *
   * @returns {Promise<{storedName: string, storagePath: string, storageProvider: string}>}
   *   storedName    - UUID-based filename (e.g. 'abc-def.jpg')
   *   storagePath   - Provider-relative path (e.g. 'profile-images/abc-def.jpg')
   *   storageProvider - Provider identifier (e.g. 'local', 's3')
   */
  async save(buffer, originalName, mimeType, category) {
    throw new Error('StorageProviderInterface.save() must be implemented.');
  }

  /**
   * Deletes a previously saved file.
   *
   * @param {string} storagePath - The storagePath returned by save()
   * @returns {Promise<void>}
   */
  async delete(storagePath) {
    throw new Error('StorageProviderInterface.delete() must be implemented.');
  }

  /**
   * Replaces an existing file: deletes old file, saves new one atomically.
   *
   * @param {string} oldStoragePath - storagePath of the existing file
   * @param {Buffer} buffer         - New file buffer
   * @param {string} originalName   - New original filename
   * @param {string} mimeType       - New MIME type
   * @param {string} category       - FILE_CATEGORIES value
   *
   * @returns {Promise<{storedName: string, storagePath: string, storageProvider: string}>}
   */
  async replace(oldStoragePath, buffer, originalName, mimeType, category) {
    throw new Error('StorageProviderInterface.replace() must be implemented.');
  }

  /**
   * Returns the public URL for a stored file.
   *
   * @param {string} storagePath - The provider-relative path
   * @returns {string}
   */
  getPublicUrl(storagePath) {
    throw new Error('StorageProviderInterface.getPublicUrl() must be implemented.');
  }
}

module.exports = StorageProviderInterface;
