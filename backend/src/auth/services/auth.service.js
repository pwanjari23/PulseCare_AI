const { sequelize } = require('#models/index.js');
const authRepository = require('../repositories/auth.repository');
const { hashPassword } = require('../utils/password');
const { ApiError } = require('#utils/apiResponse.js');
const { PATIENT_REGISTERED, DOCTOR_REGISTRATION_REQUESTED } = require('#constants/activity.constants.js');
const logger = require('#config/logger.js');

/**
 * Registers a new Patient user and profile within a transaction
 * @param {object} patientData - Patient sign up parameters
 * @returns {Promise<object>} The clean Patient user DTO
 */
const registerPatient = async (patientData) => {
  // 1. Check duplicate email
  const existingUser = await authRepository.findUserByEmail(patientData.email);
  if (existingUser) {
    logger.warn(`Patient registration failed: Email already exists: ${patientData.email}`);
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  // 2. Hash password
  const passwordHash = await hashPassword(patientData.password);

  // 3. Execute inside a transaction
  const transaction = await sequelize.transaction();

  try {
    const user = await authRepository.createUser({
      email: patientData.email,
      passwordHash,
      role: 'Patient',
      phone: patientData.phone || null,
      status: 'Active'
    }, transaction);

    const patient = await authRepository.createPatientProfile({
      id: user.id,
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      bloodType: patientData.bloodType || null,
      zipCode: patientData.zipCode || null,
      heightCm: patientData.heightCm || null,
      emergencyContactName: patientData.emergencyContactName || null,
      emergencyContactPhone: patientData.emergencyContactPhone || null,
      emergencyContactRelation: patientData.emergencyContactRelation || null,
      medicalConditions: patientData.medicalConditions || null,
      allergies: patientData.allergies || null,
      smokingStatus: patientData.smokingStatus || null,
      alcoholConsumption: patientData.alcoholConsumption || null,
      profileCompletionPct: 100
    }, transaction);

    await authRepository.insertActivityLog({
      userId: user.id,
      action: PATIENT_REGISTERED,
      module: 'Authentication',
      entity: 'User',
      entityId: user.id,
      ipAddress: patientData.ipAddress || '127.0.0.1',
      userAgent: patientData.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    logger.info(`Patient registration completed successfully for user: ${user.email}`);

    // Return safe public DTO
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Patient registration transaction rolled back. Reason: ${error.message}`);
    throw error;
  }
};

/**
 * Registers a new Doctor user and profile within a transaction (awaits admin verification approval)
 * @param {object} doctorData - Doctor sign up parameters
 * @returns {Promise<object>} The clean Doctor user DTO
 */
const registerDoctor = async (doctorData) => {
  // 1. Check duplicate email
  const existingUser = await authRepository.findUserByEmail(doctorData.email);
  if (existingUser) {
    logger.warn(`Doctor registration failed: Email already exists: ${doctorData.email}`);
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  // 2. Hash password
  const passwordHash = await hashPassword(doctorData.password);

  // 3. Execute inside a transaction
  const transaction = await sequelize.transaction();

  try {
    const user = await authRepository.createUser({
      email: doctorData.email,
      passwordHash,
      role: 'Doctor',
      phone: doctorData.phone || null,
      status: 'Inactive' // Stays inactive until admin verification
    }, transaction);

    const doctor = await authRepository.createDoctorProfile({
      id: user.id,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      licenseNumber: doctorData.licenseNumber,
      specializationId: doctorData.specializationId || null,
      clinicName: doctorData.clinicName || null,
      clinicAddress: doctorData.clinicAddress || null,
      clinicZip: doctorData.clinicZip || null,
      experienceYears: doctorData.experienceYears || null,
      languages: doctorData.languages || null,
      consultationFee: doctorData.consultationFee || 0.00,
      isVerified: false // Admin must verify credentials
    }, transaction);

    await authRepository.insertActivityLog({
      userId: user.id,
      action: DOCTOR_REGISTRATION_REQUESTED,
      module: 'Authentication',
      entity: 'User',
      entityId: user.id,
      ipAddress: doctorData.ipAddress || '127.0.0.1',
      userAgent: doctorData.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    logger.info(`Doctor registration application submitted successfully for user: ${user.email}`);

    // Return safe public DTO
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Doctor registration transaction rolled back. Reason: ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerPatient,
  registerDoctor
};
