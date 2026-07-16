const { Doctor, User, Specialization } = require('#models/index.js');

/**
 * Finds a doctor profile by their associated user ID
 * Includes associated User and Specialization details
 * @param {number|string} userId - User ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Doctor|null>} The Doctor profile
 */
const findDoctorByUserId = async (userId, transaction) => {
  return Doctor.findOne({
    where: { id: userId },
    include: [
      {
        model: User,
        as: 'user'
      },
      {
        model: Specialization,
        as: 'specialization'
      }
    ],
    transaction
  });
};

/**
 * Finds a doctor profile by primary key (Doctor ID)
 * @param {number|string} id - Doctor profile ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Doctor|null>} The Doctor profile
 */
const findDoctorById = async (id, transaction) => {
  return Doctor.findByPk(id, { transaction });
};

/**
 * Finds a doctor profile by ID including Specialization and User models
 * @param {number|string} id - Doctor profile ID
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<Doctor|null>} The Doctor profile
 */
const findDoctorWithSpecialization = async (id, transaction) => {
  return Doctor.findOne({
    where: { id },
    include: [
      {
        model: Specialization,
        as: 'specialization'
      },
      {
        model: User,
        as: 'user'
      }
    ],
    transaction
  });
};

/**
 * Updates a doctor's profile fields
 * @param {number|string} id - Doctor profile ID
 * @param {object} data - Data fields to update
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<[number]>} Array with count of affected rows
 */
const updateDoctorProfile = async (id, data, transaction) => {
  return Doctor.update(data, {
    where: { id },
    transaction
  });
};

/**
 * Updates only the profile completion percentage for a doctor
 * @param {number|string} id - Doctor profile ID
 * @param {number} percentage - The calculated completion percentage
 * @param {object} [transaction] - Optional Sequelize transaction object
 * @returns {Promise<[number]>} Array with count of affected rows
 */
const updateProfileCompletion = async (id, percentage, transaction) => {
  return Doctor.update(
    { profileCompletionPct: percentage },
    {
      where: { id },
      transaction
    }
  );
};

module.exports = {
  findDoctorByUserId,
  findDoctorById,
  findDoctorWithSpecialization,
  updateDoctorProfile,
  updateProfileCompletion
};
