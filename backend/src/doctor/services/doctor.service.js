const { sequelize } = require('#models/index.js');
const doctorRepository = require('../repositories/doctor.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const { toPrivateDoctorDto, toPublicDoctorDto } = require('../dtos/doctor.dto');
const { PROFILE_COMPLETION_FIELDS } = require('../constants/doctor.constants');
const { DOCTOR_PROFILE_UPDATED } = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');
const emailService = require('../../email/config/email');

/**
 * Calculates the profile completion percentage for a doctor dynamically.
 * @param {object} doc - The merged doctor data object
 * @returns {number} The completion percentage clamped between 0 and 100
 */
const calculateCompletion = (doc) => {
  let completedCount = 0;
  for (const field of PROFILE_COMPLETION_FIELDS) {
    const val = doc[field];
    if (val !== null && val !== undefined && val !== '') {
      if (field === 'languages') {
        if (Array.isArray(val) && val.length > 0) {
          completedCount++;
        }
      } else {
        completedCount++;
      }
    }
  }

  const pct = Math.round((completedCount / PROFILE_COMPLETION_FIELDS.length) * 100);
  return Math.min(100, Math.max(0, pct));
};

/**
 * Helper to compare whether two arrays are equal
 */
const arraysEqual = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  
  // Sort copies to compare elements order-independently
  const copyA = [...a].sort();
  const copyB = [...b].sort();
  for (let i = 0; i < copyA.length; i++) {
    if (copyA[i] !== copyB[i]) return false;
  }
  return true;
};

/**
 * Loads the complete profile for a logged-in doctor.
 * @param {number|string} userId - The user ID
 * @returns {Promise<object>} Private Doctor DTO
 */
const getDoctorProfile = async (userId) => {
  const doctor = await doctorRepository.findDoctorByUserId(userId);
  if (!doctor) {
    logger.warn(`Doctor profile load failed: Doctor ID ${userId} not found.`);
    throw new ApiError(404, 'Doctor profile not found.');
  }

  logger.info(`Doctor profile loaded successfully for User ID: ${userId}`);
  return toPrivateDoctorDto(doctor);
};

/**
 * Updates the logged-in doctor's profile details.
 * Performs dynamic completion checks, database writes within a transaction, and conditional audit logging.
 * @param {number|string} userId - The user ID of the doctor
 * @param {object} data - Input fields to update
 * @param {object} metadata - Client request metadata (IP, user agent)
 * @returns {Promise<object>} Updated Private Doctor DTO
 */
const updateDoctorProfile = async (userId, data, metadata = {}) => {
  const doctor = await doctorRepository.findDoctorByUserId(userId);
  if (!doctor) {
    logger.warn(`Doctor profile update failed: Doctor ID ${userId} not found.`);
    throw new ApiError(404, 'Doctor profile not found.');
  }

  // 1. Map fields to schema variables
  const updateData = {};
  if (data.specializationId !== undefined) updateData.specializationId = data.specializationId;
  if (data.clinicName !== undefined) updateData.clinicName = data.clinicName;
  if (data.clinicAddress !== undefined) updateData.clinicAddress = data.clinicAddress;
  if (data.clinicZip !== undefined) updateData.clinicZip = data.clinicZip;
  if (data.experienceYears !== undefined) updateData.experienceYears = data.experienceYears;
  if (data.consultationFee !== undefined) updateData.consultationFee = data.consultationFee;
  if (data.languages !== undefined) updateData.languages = data.languages;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.profileImage !== undefined) updateData.profilePhotoUrl = data.profileImage;

  // 2. Detect if any fields actually changed compared to the database
  let hasChanged = false;
  const checkFields = ['specializationId', 'clinicName', 'clinicAddress', 'clinicZip', 'experienceYears', 'bio'];
  for (const key of checkFields) {
    if (updateData[key] !== undefined && String(updateData[key]) !== String(doctor[key])) {
      hasChanged = true;
    }
  }

  if (updateData.consultationFee !== undefined) {
    if (parseFloat(updateData.consultationFee) !== parseFloat(doctor.consultationFee)) {
      hasChanged = true;
    }
  }

  if (updateData.profilePhotoUrl !== undefined && updateData.profilePhotoUrl !== doctor.profilePhotoUrl) {
    hasChanged = true;
  }

  if (updateData.languages !== undefined) {
    if (!arraysEqual(updateData.languages, doctor.languages)) {
      hasChanged = true;
    }
  }

  // 3. Begin Transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 4. Update doctor profile
    if (hasChanged) {
      await doctorRepository.updateDoctorProfile(doctor.id, updateData, transaction);
      logger.info(`Doctor profile fields changed. Updating Doctor ID ${doctor.id}.`);
    } else {
      logger.info(`Empty or no-op profile update requested for Doctor ID ${doctor.id}.`);
    }

    // 5. Calculate profile completion dynamically using merged state
    const mergedState = {
      ...doctor.toJSON(),
      ...updateData
    };
    const completionPercentage = calculateCompletion(mergedState);

    // 6. Update profile_completion_pct in database
    // Even if no field changed, we ensure completion percentage is written if recalculated
    await doctorRepository.updateProfileCompletion(doctor.id, completionPercentage, transaction);

    // 7. Insert activity log (only if changes occurred)
    if (hasChanged) {
      await authRepository.insertActivityLog({
        userId: doctor.id,
        action: DOCTOR_PROFILE_UPDATED,
        module: 'Doctor Management',
        entity: 'Doctor',
        entityId: doctor.id,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date()
      }, transaction);
    }

    // 8. Commit Transaction
    await transaction.commit();
    transactionFinished = true;

    // Fetch refreshed complete record to return in response
    const refreshedDoctor = await doctorRepository.findDoctorByUserId(userId);
    return toPrivateDoctorDto(refreshedDoctor);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Doctor profile update transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Loads the public profile for a verified doctor.
 * Returns 404 for unverified doctors to maintain patient-safe checks.
 * @param {number|string} id - Doctor ID
 * @returns {Promise<object>} Public Doctor DTO
 */
const getPublicDoctorProfile = async (id) => {
  const doctor = await doctorRepository.findDoctorWithSpecialization(id);
  if (!doctor || !doctor.isVerified) {
    logger.warn(`Public doctor profile load failed: Doctor ID ${id} is either unverified or missing.`);
    throw new ApiError(404, 'Doctor profile not found.');
  }

  logger.info(`Public doctor profile loaded successfully for Doctor ID: ${id}`);
  return toPublicDoctorDto(doctor);
};

/**
 * Loads the complete doctor profile for admins.
 * @param {number|string} id - Doctor ID
 * @returns {Promise<object>} Private Doctor DTO (Complete Profile)
 */
const getDoctorProfileForAdmin = async (id) => {
  const doctor = await doctorRepository.findDoctorWithSpecialization(id);
  if (!doctor) {
    logger.warn(`Admin doctor profile load failed: Doctor ID ${id} not found.`);
    throw new ApiError(404, 'Doctor profile not found.');
  }

  logger.info(`Admin doctor profile loaded successfully for Doctor ID: ${id}`);
  return toPrivateDoctorDto(doctor);
};

/**
 * Approves a doctor application, activating their account and verifying their profile.
 */
const approveDoctor = async (doctorId, adminUserId = null, metadata = {}) => {
  const doctor = await doctorRepository.findDoctorByUserId(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }

  const transaction = await sequelize.transaction();
  try {
    await doctor.update({ isVerified: true }, { transaction });
    if (doctor.user) {
      await doctor.user.update({ status: 'Active' }, { transaction });
    }

    if (adminUserId) {
      await authRepository.insertActivityLog({
        userId: adminUserId,
        action: 'DOCTOR_APPROVED',
        module: 'Doctor Management',
        entity: 'Doctor',
        entityId: doctorId,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date()
      }, transaction);
    }

    await transaction.commit();

    // Send email (non-blocking)
    if (doctor.user && doctor.user.email) {
      emailService.sendDoctorApprovalEmail(doctor.user.email, {
        firstName: doctor.firstName,
        email: doctor.user.email
      }).catch((err) => {
        logger.error(`[DoctorService] Non-blocking doctor approval email dispatch failed: ${err.message}`);
      });
    }

    return { id: doctorId, isVerified: true, status: 'Active' };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Doctor approval failed for ID ${doctorId}. Error: ${error.message}`);
    throw error;
  }
};

/**
 * Rejects a doctor application.
 */
const rejectDoctor = async (doctorId, reason, adminUserId = null, metadata = {}) => {
  const doctor = await doctorRepository.findDoctorByUserId(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }

  const transaction = await sequelize.transaction();
  try {
    await doctor.update({ isVerified: false }, { transaction });
    if (doctor.user) {
      await doctor.user.update({ status: 'Inactive' }, { transaction });
    }

    if (adminUserId) {
      await authRepository.insertActivityLog({
        userId: adminUserId,
        action: 'DOCTOR_REJECTED',
        module: 'Doctor Management',
        entity: 'Doctor',
        entityId: doctorId,
        ipAddress: metadata.ipAddress || '127.0.0.1',
        userAgent: metadata.userAgent || 'Unknown',
        created_at: new Date()
      }, transaction);
    }

    await transaction.commit();

    // Send email (non-blocking)
    if (doctor.user && doctor.user.email) {
      emailService.sendDoctorRejectionEmail(doctor.user.email, {
        firstName: doctor.firstName,
        email: doctor.user.email,
        reason
      }).catch((err) => {
        logger.error(`[DoctorService] Non-blocking doctor rejection email dispatch failed: ${err.message}`);
      });
    }

    return { id: doctorId, isVerified: false, status: 'Inactive' };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Doctor rejection failed for ID ${doctorId}. Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  getPublicDoctorProfile,
  getDoctorProfileForAdmin,
  approveDoctor,
  rejectDoctor
};
