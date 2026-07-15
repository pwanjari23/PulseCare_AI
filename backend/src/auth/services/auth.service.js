const { sequelize } = require('#models/index.js');
const authRepository = require('../repositories/auth.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { ApiError } = require('#utils/apiResponse.js');
const { PATIENT_REGISTERED, DOCTOR_REGISTRATION_REQUESTED } = require('#constants/activity.constants.js');
const logger = require('#config/logger.js');

/**
 * Registers a new Patient user and profile within a transaction
 * @param {object} patientData - Patient sign up parameters
 * @returns {Promise<object>} The clean Patient user DTO
 */
const registerPatient = async (patientData) => {
  const existingUser = await authRepository.findUserByEmail(patientData.email);
  if (existingUser) {
    logger.warn(`Patient registration failed: Email already exists: ${patientData.email}`);
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(patientData.password);
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
  const existingUser = await authRepository.findUserByEmail(doctorData.email);
  if (existingUser) {
    logger.warn(`Doctor registration failed: Email already exists: ${doctorData.email}`);
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(doctorData.password);
  const transaction = await sequelize.transaction();

  try {
    const user = await authRepository.createUser({
      email: doctorData.email,
      passwordHash,
      role: 'Doctor',
      phone: doctorData.phone || null,
      status: 'Inactive'
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
      isVerified: false
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

/**
 * Authenticates user credentials and issues session tokens
 * @param {object} credentials - User email, password, and request environment metadata
 * @returns {Promise<object>} The authentication response payload including access and refresh tokens
 */
const loginUser = async (credentials) => {
  const user = await authRepository.findUserByEmail(credentials.email);

  // 1. Verify user exists
  if (!user) {
    logger.warn(`Login failed: Email address not found: ${credentials.email}`);
    await authRepository.insertActivityLog({
      userId: null,
      action: 'LOGIN_FAILED',
      module: 'Authentication',
      entity: 'User',
      ipAddress: credentials.ipAddress || '127.0.0.1',
      userAgent: credentials.userAgent || 'Unknown',
      created_at: new Date()
    });
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 2. Verify password match
  const isMatch = await comparePassword(credentials.password, user.passwordHash);
  if (!isMatch) {
    logger.warn(`Login failed: Password mismatch for user: ${credentials.email}`);
    await authRepository.insertActivityLog({
      userId: user.id,
      action: 'LOGIN_FAILED',
      module: 'Authentication',
      entity: 'User',
      entityId: user.id,
      ipAddress: credentials.ipAddress || '127.0.0.1',
      userAgent: credentials.userAgent || 'Unknown',
      created_at: new Date()
    });
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 3. Verify user status is Active
  if (user.status !== 'Active') {
    logger.warn(`Login rejected: User account status is [${user.status}] for: ${credentials.email}`);
    await authRepository.insertActivityLog({
      userId: user.id,
      action: 'LOGIN_FAILED',
      module: 'Authentication',
      entity: 'User',
      entityId: user.id,
      ipAddress: credentials.ipAddress || '127.0.0.1',
      userAgent: credentials.userAgent || 'Unknown',
      created_at: new Date()
    });
    throw new ApiError(403, 'Your account is inactive or suspended.');
  }

  // 4. Generate Access and Refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Expiration boundary calculation: 7 days offset
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 5. Store session in refresh_tokens table
  await authRepository.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt
  });

  // 6. Update user's last login state
  await authRepository.updateLastLogin(user.id);

  // 7. Log login success
  await authRepository.insertActivityLog({
    userId: user.id,
    action: 'LOGIN_SUCCESS',
    module: 'Authentication',
    entity: 'User',
    entityId: user.id,
    ipAddress: credentials.ipAddress || '127.0.0.1',
    userAgent: credentials.userAgent || 'Unknown',
    created_at: new Date()
  });

  logger.info(`Login successful: Authenticated user: ${user.email} (Role: ${user.role})`);

  // Return DTO response
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    },
    accessToken,
    refreshToken
  };
};

module.exports = {
  registerPatient,
  registerDoctor,
  loginUser
};
