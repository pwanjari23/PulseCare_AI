const { User, Patient, Doctor, ActivityLog } = require('#models/index.js');

/**
 * Finds a user by their email address
 * @param {string} email - The email to search for
 * @returns {Promise<User|null>} The found user or null
 */
const findUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Finds a user by their phone number
 * @param {string} phone - The phone number to search for
 * @returns {Promise<User|null>} The found user or null
 */
const findUserByPhone = async (phone) => {
  return User.findOne({ where: { phone } });
};

/**
 * Creates a new user record
 * @param {object} userData - The user fields
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<User>} The created user
 */
const createUser = async (userData, transaction) => {
  return User.create(userData, { transaction });
};

/**
 * Creates a new patient profile record
 * @param {object} patientData - The patient fields
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Patient>} The created patient profile
 */
const createPatientProfile = async (patientData, transaction) => {
  return Patient.create(patientData, { transaction });
};

/**
 * Creates a new doctor profile record
 * @param {object} doctorData - The doctor fields
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Doctor>} The created doctor profile
 */
const createDoctorProfile = async (doctorData, transaction) => {
  return Doctor.create(doctorData, { transaction });
};

/**
 * Creates a new audit activity log entry
 * @param {object} logData - The log fields
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<ActivityLog>} The created activity log
 */
const insertActivityLog = async (logData, transaction) => {
  return ActivityLog.create(logData, { transaction });
};

module.exports = {
  findUserByEmail,
  findUserByPhone,
  createUser,
  createPatientProfile,
  createDoctorProfile,
  insertActivityLog
};
