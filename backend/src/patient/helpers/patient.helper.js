const { PATIENT_COMPLETION_FIELDS } = require('../constants/patient.constants');

/**
 * Calculates patient profile completion dynamically.
 * Ignores null, undefined, empty strings, and empty arrays.
 * Clamps the return value between 0 and 100.
 * @param {object} patient - The patient data object (can be Sequelize instance or plain object)
 * @returns {number} The completion percentage as an integer
 */
const calculateProfileCompletion = (patient) => {
  if (!patient) return 0;
  
  let completedCount = 0;
  for (const field of PATIENT_COMPLETION_FIELDS) {
    const val = patient[field];
    if (val !== null && val !== undefined && val !== '') {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          completedCount++;
        }
      } else {
        completedCount++;
      }
    }
  }

  const percentage = Math.round((completedCount / PATIENT_COMPLETION_FIELDS.length) * 100);
  return Math.min(100, Math.max(0, percentage));
};

module.exports = {
  calculateProfileCompletion
};
