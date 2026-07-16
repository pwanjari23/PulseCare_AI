const { Patient, User, DoctorRequest, Appointment } = require('#models/index.js');

/**
 * Finds a patient profile by their associated User ID.
 * Includes User association.
 * @param {number|string} userId - The user ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Patient|null>} Patient profile
 */
const findPatientByUserId = async (userId, transaction) => {
  return Patient.findOne({
    where: { id: userId },
    include: [{ model: User, as: 'user' }],
    transaction
  });
};

/**
 * Finds a patient profile by primary key.
 * @param {number|string} id - Patient ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Patient|null>} Patient profile
 */
const findPatientById = async (id, transaction) => {
  return Patient.findByPk(id, { transaction });
};

/**
 * Finds a patient profile by ID, including User model.
 * @param {number|string} id - Patient ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Patient|null>} Patient profile
 */
const findPatientWithUser = async (id, transaction) => {
  return Patient.findOne({
    where: { id },
    include: [{ model: User, as: 'user' }],
    transaction
  });
};

/**
 * Checks if a specific doctor is set as the patient's primary doctor.
 * @param {number|string} patientId - Patient ID
 * @param {number|string} doctorId - Doctor ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<boolean>} True if doctor is primary
 */
const findPrimaryDoctor = async (patientId, doctorId, transaction) => {
  const patient = await Patient.findOne({
    where: { id: patientId, primaryDoctorId: doctorId },
    transaction
  });
  return !!patient;
};

/**
 * Checks if there is an accepted DoctorRequest between the patient and doctor.
 * @param {number|string} patientId - Patient ID
 * @param {number|string} doctorId - Doctor ID
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<boolean>} True if accepted request exists
 */
const findAcceptedDoctorRequest = async (patientId, doctorId, transaction) => {
  const request = await DoctorRequest.findOne({
    where: { patientId, doctorId, status: 'Accepted' },
    transaction
  });
  return !!request;
};

/**
 * Checks if an appointment exists between the patient and doctor.
 * @param {number|string} patientId - Patient ID
 * @param {number|string} doctorId - Doctor ID
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<boolean>} True if appointment exists
 */
const findAppointment = async (patientId, doctorId, transaction) => {
  const appointment = await Appointment.findOne({
    where: { patientId, doctorId },
    transaction
  });
  return !!appointment;
};

/**
 * Updates a patient's profile details.
 * @param {number|string} id - Patient ID
 * @param {object} data - Data fields to update
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<[number]>} Array with count of affected rows
 */
const updatePatientProfile = async (id, data, transaction) => {
  return Patient.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Updates only the profile completion percentage for a patient.
 * @param {number|string} id - Patient ID
 * @param {number} percentage - Recalculated completion rate (0-100)
 * @param {object} [transaction] - Optional Sequelize transaction
 * @returns {Promise<[number]>} Array with count of affected rows
 */
const updateProfileCompletion = async (id, percentage, transaction) => {
  return Patient.update(
    { profileCompletionPct: percentage },
    {
      where: { id },
      transaction
    }
  );
};

module.exports = {
  findPatientByUserId,
  findPatientById,
  findPatientWithUser,
  findPrimaryDoctor,
  findAcceptedDoctorRequest,
  findAppointment,
  updatePatientProfile,
  updateProfileCompletion
};
