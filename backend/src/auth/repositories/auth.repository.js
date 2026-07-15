const { User, Patient, Doctor, ActivityLog, RefreshToken } = require('#models/index.js');

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
 * Finds a user by their email, including their patient or doctor profile
 * @param {string} email - The email to search for
 * @returns {Promise<User|null>} The user instance with profile nested or null
 */
const findUserWithProfile = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const include = [];
  if (user.role === 'Patient') {
    include.push({ model: Patient, as: 'patient' });
  } else if (user.role === 'Doctor') {
    include.push({ model: Doctor, as: 'doctor' });
  }

  return User.findOne({
    where: { email },
    include
  });
};

/**
 * Updates the user's last login state
 * Since the finalized users table has no last_login_at column, we update 
 * the Doctor's lastActiveAt if the user has a doctor profile, and resolve.
 * @param {number|string} userId - The user ID to update
 * @returns {Promise<boolean>} True on success
 */
const updateLastLogin = async (userId) => {
  const user = await User.findByPk(userId);
  if (user && user.role === 'Doctor') {
    await Doctor.update(
      { lastActiveAt: new Date() },
      { where: { id: userId } }
    );
  }
  return true;
};

/**
 * Creates a new refresh token record
 * @param {object} tokenData - Token properties (userId, token, expiresAt)
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<RefreshToken>} The created token instance
 */
const createRefreshToken = async (tokenData, transaction) => {
  return RefreshToken.create(tokenData, { transaction });
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
  findUserWithProfile,
  updateLastLogin,
  createRefreshToken,
  createUser,
  createPatientProfile,
  createDoctorProfile,
  insertActivityLog
};
