/**
 * Helper to calculate age from Date of Birth dynamically
 * @param {string|Date} dob - Date of Birth
 * @returns {number|null} Calculated age or null
 */
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Maps Sequelize patient to the complete Private Patient DTO.
 * Excludes passwords, deletedAt, tokens, and internal metadata.
 * @param {object} patient - Sequelize Patient instance
 * @param {object} [user] - Associated Sequelize User instance
 * @returns {object} Complete Private DTO
 */
const toPrivatePatientDto = (patient, user) => {
  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: user ? user.email : (patient.user ? patient.user.email : null),
    phone: user ? user.phone : (patient.user ? patient.user.phone : null),
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    bloodType: patient.bloodType,
    bloodGroup: patient.bloodType,
    zipCode: patient.zipCode,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    emergencyContactRelation: patient.emergencyContactRelation,
    heightCm: patient.heightCm,
    weightKg: patient.weightKg,
    allergies: patient.allergies,
    medicalConditions: patient.medicalConditions,
    smokingStatus: patient.smokingStatus,
    alcoholConsumption: patient.alcoholConsumption,
    profileCompletionPercentage: patient.profileCompletionPct || 0,
    status: user ? user.status : (patient.user ? patient.user.status : null)
  };
};

/**
 * Maps Sequelize patient to Doctor-safe DTO.
 * Removes contact details (email, phone, etc.) and exposes dynamic age.
 * @param {object} patient - Sequelize Patient instance
 * @returns {object} Doctor-safe Patient DTO
 */
const toDoctorPatientDto = (patient) => {
  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    gender: patient.gender,
    age: calculateAge(patient.dateOfBirth),
    bloodType: patient.bloodType,
    zipCode: patient.zipCode,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactRelation: patient.emergencyContactRelation,
    heightCm: patient.heightCm,
    weightKg: patient.weightKg,
    allergies: patient.allergies,
    medicalConditions: patient.medicalConditions,
    smokingStatus: patient.smokingStatus,
    alcoholConsumption: patient.alcoholConsumption,
    profileCompletionPercentage: patient.profileCompletionPct || 0
  };
};

/**
 * Maps Sequelize patient to minimal Public Patient DTO.
 * @param {object} patient - Sequelize Patient instance
 * @returns {object} Minimal Public Patient DTO
 */
const toPublicPatientDto = (patient) => {
  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName
  };
};

module.exports = {
  toPrivatePatientDto,
  toDoctorPatientDto,
  toPublicPatientDto
};
