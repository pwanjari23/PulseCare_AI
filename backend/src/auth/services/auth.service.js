const { sequelize } = require('#models/index.js');
const authRepository = require('../repositories/auth.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { ApiError } = require('#utils/apiResponse.js');
const { PATIENT_REGISTERED, DOCTOR_REGISTRATION_REQUESTED, LOGIN_REFRESH, LOGOUT, REFRESH_TOKEN_REVOKED } = require('#constants/activity.constants.js');
const logger = require('#config/logger.js');
const emailService = require('../../email/config/email');

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

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(user.email, { firstName: patientData.firstName }).catch((err) => {
      logger.error(`[AuthService] Non-blocking patient welcome email dispatch failed: ${err.message}`);
    });

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

    // Send doctor registration confirmation email (non-blocking)
    emailService.sendDoctorRegistrationEmail(user.email, { firstName: doctorData.firstName }).catch((err) => {
      logger.error(`[AuthService] Non-blocking doctor registration email dispatch failed: ${err.message}`);
    });

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

/**
 * Parses JWT expiry string to seconds.
 * @param {string|number} expiry - Expiry duration
 * @returns {number} duration in seconds
 */
const parseExpiryToSeconds = (expiry) => {
  if (!expiry) return 900;
  if (typeof expiry === 'number') return expiry;
  const unit = expiry.slice(-1);
  const val = parseInt(expiry.slice(0, -1), 10);
  if (isNaN(val)) return 900;
  switch (unit) {
    case 's': return val;
    case 'm': return val * 60;
    case 'h': return val * 3600;
    case 'd': return val * 86400;
    default: return parseInt(expiry, 10) || 900;
  }
};

/**
 * Refreshes an expired access token using a valid refresh token.
 * Uses database transaction, token rotation, and activity logs.
 * @param {string} refreshToken - The refresh token
 * @param {object} metadata - Client IP and User Agent metadata
 * @returns {Promise<object>} Fresh tokens and user details DTO
 */
const refreshAccessToken = async (refreshToken, metadata = {}) => {
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 2. Validate Refresh Token (JWT signature)
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (jwtError) {
      logger.warn(`Refresh token signature verification failed: ${jwtError.message}`);
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    // 3. Find Database Record
    const storedToken = await authRepository.findRefreshToken(refreshToken, transaction);
    if (!storedToken) {
      logger.warn('Refresh token database record not found.');
      
      // Rollback main transaction before logging failure to avoid lock issues
      await transaction.rollback();
      transactionFinished = true;
      
      // Log REFRESH_TOKEN_REVOKED activity outside the transaction so it persists
      try {
        await authRepository.insertActivityLog({
          userId: decoded.id,
          action: REFRESH_TOKEN_REVOKED,
          module: 'Authentication',
          entity: 'User',
          entityId: decoded.id,
          ipAddress: metadata.ipAddress || '127.0.0.1',
          userAgent: metadata.userAgent || 'Unknown',
          created_at: new Date()
        });
      } catch (logErr) {
        logger.error(`Failed to log REFRESH_TOKEN_REVOKED: ${logErr.message}`);
      }

      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    // 4. Load User
    const user = await authRepository.findUserById(storedToken.userId, transaction);
    if (!user) {
      logger.warn(`User no longer exists for User ID ${storedToken.userId}`);
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    // 5. Validate User Status
    if (user.status !== 'Active') {
      logger.warn(`Refresh rejected: User status is [${user.status}] for User ID ${user.id}`);
      throw new ApiError(403, 'Your account is inactive or suspended.');
    }

    // 6. Generate New Tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Rotate 7 days expiry
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 7. Rotate Refresh Token
    await authRepository.updateRefreshToken(refreshToken, newRefreshToken, newExpiresAt, transaction);

    // 8. Insert Activity Log
    await authRepository.insertActivityLog({
      userId: user.id,
      action: LOGIN_REFRESH,
      module: 'Authentication',
      entity: 'User',
      entityId: user.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // 9. Commit Transaction
    await transaction.commit();
    transactionFinished = true;

    const config = require('#config/jwt.js');
    const expiresIn = parseExpiryToSeconds(config.accessExpiry);

    // 10. Return Response DTO (clean, no passwordHash/internal metadata)
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn
    };
  } catch (error) {
    if (!transactionFinished) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Invalidates user refresh token and records LOGOUT activity.
 * @param {string} refreshToken - The refresh token
 * @param {object} metadata - Client IP and User Agent metadata
 * @returns {Promise<object>} success response object
 */
const logoutUser = async (refreshToken, metadata = {}) => {
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 1. Verify token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (jwtError) {
      logger.warn(`Logout signature verification failed: ${jwtError.message}`);
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    // 2. Find Database Record & Delete it
    const storedToken = await authRepository.findRefreshToken(refreshToken, transaction);
    if (!storedToken) {
      logger.warn('Logout failed: Token record not found.');
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    await authRepository.deleteRefreshToken(refreshToken, transaction);

    // 3. Record LOGOUT activity
    await authRepository.insertActivityLog({
      userId: decoded.id,
      action: LOGOUT,
      module: 'Authentication',
      entity: 'User',
      entityId: decoded.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;
    return { success: true };
  } catch (error) {
    if (!transactionFinished) {
      await transaction.rollback();
    }
    throw error;
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  loginUser,
  refreshAccessToken,
  logoutUser
};
