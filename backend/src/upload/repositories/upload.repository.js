/**
 * PulseCare AI – Upload Repository
 *
 * Provides all database interactions for the uploaded_files table.
 * The service layer must use these methods exclusively — never
 * call the model directly from the service.
 */

const { UploadedFile } = require('#models/index.js');
const { v4: uuidv4 } = require('uuid');

/**
 * Persists a new uploaded file record to the database.
 *
 * @param {object} data         - File metadata
 * @param {object} [transaction]- Optional Sequelize transaction
 * @returns {Promise<UploadedFile>}
 */
const createFile = async (data, transaction = null) => {
  return UploadedFile.create(
    {
      uuid:            uuidv4(),
      originalName:    data.originalName,
      storedName:      data.storedName,
      mimeType:        data.mimeType,
      extension:       data.extension,
      sizeBytes:       data.sizeBytes,
      category:        data.category,
      storageProvider: data.storageProvider,
      storagePath:     data.storagePath,
      uploadedBy:      data.uploadedBy,
    },
    { transaction }
  );
};

/**
 * Finds an uploaded file record by its internal ID.
 *
 * @param {number} id
 * @returns {Promise<UploadedFile|null>}
 */
const findById = async (id) => {
  return UploadedFile.findByPk(id);
};

/**
 * Finds an uploaded file record by its public UUID.
 *
 * @param {string} uuid
 * @returns {Promise<UploadedFile|null>}
 */
const findByUuid = async (uuid) => {
  return UploadedFile.findOne({ where: { uuid } });
};

/**
 * Updates an existing file record (used for replace operations).
 *
 * @param {number} id            - Internal primary key
 * @param {object} updates       - Fields to update
 * @param {object} [transaction]
 * @returns {Promise<[number]>}   - Number of affected rows
 */
const updateFile = async (id, updates, transaction = null) => {
  return UploadedFile.update(updates, { where: { id }, transaction });
};

/**
 * Deletes an uploaded file record from the database.
 *
 * @param {number} id
 * @param {object} [transaction]
 * @returns {Promise<number>} - Number of rows deleted
 */
const deleteFile = async (id, transaction = null) => {
  return UploadedFile.destroy({ where: { id }, transaction });
};

/**
 * Returns all file records uploaded by a specific user.
 *
 * @param {number} uploadedBy - User ID
 * @param {string} [category] - Optional category filter
 * @returns {Promise<UploadedFile[]>}
 */
const findUserFiles = async (uploadedBy, category = null) => {
  const where = { uploadedBy };
  if (category) where.category = category;
  return UploadedFile.findAll({ where, order: [['created_at', 'DESC']] });
};

/**
 * Returns the most recent file for a user in a given category.
 * Useful for "replace profile image" logic.
 *
 * @param {number} uploadedBy
 * @param {string} category
 * @returns {Promise<UploadedFile|null>}
 */
const findLatestUserFileByCategory = async (uploadedBy, category) => {
  return UploadedFile.findOne({
    where: { uploadedBy, category },
    order: [['created_at', 'DESC']],
  });
};

/**
 * Returns all uploaded file records (Admin use).
 *
 * @returns {Promise<UploadedFile[]>}
 */
const findAll = async () => {
  return UploadedFile.findAll({ order: [['created_at', 'DESC']] });
};

module.exports = {
  createFile,
  findById,
  findByUuid,
  updateFile,
  deleteFile,
  findUserFiles,
  findLatestUserFileByCategory,
  findAll,
};
