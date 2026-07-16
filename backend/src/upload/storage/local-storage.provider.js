/**
 * PulseCare AI – Local Filesystem Storage Provider
 *
 * Implements StorageProviderInterface for local development.
 * Files are stored under: backend/uploads/<category-dir>/<uuid>.<ext>
 *
 * To switch to AWS S3 or another provider in production, replace this file
 * with an S3StorageProvider (or similar) that implements the same interface.
 * No service code needs to change.
 */

const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const StorageProviderInterface = require('./storage.interface');
const { UPLOAD_DIRECTORIES } = require('../constants/upload.constants');
const logger = require('#config/logger.js');

/** Absolute path to the uploads root directory (backend/uploads/) */
const UPLOADS_ROOT = path.resolve(__dirname, '../../../../uploads');

class LocalStorageProvider extends StorageProviderInterface {
  /**
   * Returns the absolute directory path for a given category.
   */
  _categoryDir(category) {
    const subdir = UPLOAD_DIRECTORIES[category];
    if (!subdir) throw new Error(`Unknown file category: ${category}`);
    return path.join(UPLOADS_ROOT, subdir);
  }

  /**
   * Extracts extension from original filename (lowercase, without dot).
   */
  _extractExtension(originalName) {
    const ext = path.extname(originalName).replace('.', '').toLowerCase();
    return ext || 'bin';
  }

  /**
   * Ensures the target directory exists, creating it recursively if needed.
   */
  async _ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Saves a file buffer to the local filesystem.
   * Returns storedName and relative storagePath (for DB storage).
   */
  async save(buffer, originalName, mimeType, category) {
    const ext = this._extractExtension(originalName);
    const fileUuid = uuidv4();
    const storedName = `${fileUuid}.${ext}`;
    const subdir = UPLOAD_DIRECTORIES[category];
    const storagePath = `${subdir}/${storedName}`;   // relative path stored in DB
    const absolutePath = path.join(UPLOADS_ROOT, storagePath);

    await this._ensureDir(path.dirname(absolutePath));
    await fs.writeFile(absolutePath, buffer);

    logger.info(`[LocalStorage] Saved file: ${storagePath}`);

    return {
      storedName,
      storagePath,
      storageProvider: 'local',
    };
  }

  /**
   * Deletes a file from local storage by its storagePath.
   * Silently ignores ENOENT (file already gone).
   */
  async delete(storagePath) {
    const absolutePath = path.join(UPLOADS_ROOT, storagePath);
    try {
      await fs.unlink(absolutePath);
      logger.info(`[LocalStorage] Deleted file: ${storagePath}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.warn(`[LocalStorage] File not found for deletion (already gone): ${storagePath}`);
      } else {
        logger.error(`[LocalStorage] Error deleting file ${storagePath}: ${err.message}`);
        throw err;
      }
    }
  }

  /**
   * Replaces an existing file: saves new file first, then deletes old one.
   * If save fails, old file is untouched (safe failure).
   */
  async replace(oldStoragePath, buffer, originalName, mimeType, category) {
    // Save the new file first
    const result = await this.save(buffer, originalName, mimeType, category);

    // Delete the old file (non-blocking, ignore missing files)
    this.delete(oldStoragePath).catch((err) => {
      logger.error(`[LocalStorage] Failed to delete old file during replace: ${err.message}`);
    });

    return result;
  }

  /**
   * Returns the public URL for accessing a stored file.
   * Static serving is configured in app.js: app.use('/uploads', express.static(...))
   */
  getPublicUrl(storagePath) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    return `${BASE_URL}/uploads/${storagePath}`;
  }
}

module.exports = new LocalStorageProvider();
