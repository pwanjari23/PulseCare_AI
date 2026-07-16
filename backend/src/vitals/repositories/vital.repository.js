const { VitalsLog, VitalsAlert, Patient } = require('#models/index.js');

/**
 * Creates a new vital signs log record.
 * @param {object} data - Field attributes
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<VitalsLog>} Created VitalsLog instance
 */
const createVital = async (data, transaction) => {
  return VitalsLog.create(data, { transaction });
};

/**
 * Updates an existing vital signs log record.
 * @param {number|string} id - Record ID
 * @param {object} data - Fields to update
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<[number]>} Number of affected rows
 */
const updateVital = async (id, data, transaction) => {
  return VitalsLog.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Deletes a vital signs log record.
 * @param {number|string} id - Record ID
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<number>} Number of deleted rows
 */
const deleteVital = async (id, transaction) => {
  return VitalsLog.destroy({
    where: { id },
    transaction
  });
};

/**
 * Finds a vital signs log record by ID.
 * @param {number|string} id - Record ID
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<VitalsLog|null>} The VitalsLog instance
 */
const findVitalById = async (id, transaction) => {
  return VitalsLog.findByPk(id, {
    include: [
      { model: Patient, as: 'patient' },
      { model: VitalsAlert, as: 'alert' }
    ],
    transaction
  });
};

/**
 * Finds all vital signs log records for a patient.
 * @param {number|string} patientId - Patient ID
 * @returns {Promise<VitalsLog[]>} List of VitalsLog instances
 */
const findPatientVitals = async (patientId) => {
  return VitalsLog.findAll({
    where: { patientId },
    order: [['loggedAt', 'DESC']],
    include: [
      { model: Patient, as: 'patient' },
      { model: VitalsAlert, as: 'alert' }
    ]
  });
};

/**
 * Finds the latest vital signs log record for a patient.
 * @param {number|string} patientId - Patient ID
 * @returns {Promise<VitalsLog|null>} The latest VitalsLog instance
 */
const findLatestVital = async (patientId) => {
  return VitalsLog.findOne({
    where: { patientId },
    order: [['loggedAt', 'DESC']],
    include: [
      { model: Patient, as: 'patient' },
      { model: VitalsAlert, as: 'alert' }
    ]
  });
};

/**
 * Creates an alert entry inside the vitals_alerts table.
 * @param {object} data - Alert attributes
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<VitalsAlert>} Created VitalsAlert instance
 */
const createAlert = async (data, transaction) => {
  return VitalsAlert.create(data, { transaction });
};

module.exports = {
  createVital,
  updateVital,
  deleteVital,
  findVitalById,
  findPatientVitals,
  findLatestVital,
  createAlert
};
