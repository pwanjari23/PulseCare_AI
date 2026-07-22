const { sequelize } = require('#models/index.js');
const patientRepository = require('../repositories/patient.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const { calculateProfileCompletion } = require('../helpers/patient.helper');
const { toPrivatePatientDto, toDoctorPatientDto } = require('../dtos/patient.dto');
const { PATIENT_PROFILE_UPDATED } = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Retrieves the logged-in patient's own complete profile.
 * @param {number|string} userId - User ID of the patient
 * @returns {Promise<object>} Private Patient DTO
 */
const getMyProfile = async (userId) => {
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    logger.warn(`Patient profile load failed: Patient ID ${userId} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  logger.info(`Patient profile loaded successfully for User ID: ${userId}`);
  return toPrivatePatientDto(patient);
};

/**
 * Updates the logged-in patient's profile.
 * Handles change detection, transactions, completion rate recalculation, and audit logs.
 * @param {number|string} userId - Patient ID
 * @param {object} data - Input fields to update
 * @param {object} metadata - Client request metadata (IP, user agent)
 * @returns {Promise<object>} Updated Private Patient DTO
 */
const updateMyProfile = async (userId, data, metadata = {}) => {
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    logger.warn(`Patient profile update failed: Patient ID ${userId} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  // 1. Map fields to update
  const updateData = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
  if (data.bloodType !== undefined) updateData.bloodType = data.bloodType;
  if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
  if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName;
  if (data.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = data.emergencyContactPhone;
  if (data.emergencyContactRelation !== undefined) updateData.emergencyContactRelation = data.emergencyContactRelation;
  if (data.heightCm !== undefined) updateData.heightCm = data.heightCm;
  if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
  if (data.allergies !== undefined) updateData.allergies = data.allergies;
  if (data.medicalConditions !== undefined) updateData.medicalConditions = data.medicalConditions;
  if (data.smokingStatus !== undefined) updateData.smokingStatus = data.smokingStatus;
  if (data.alcoholConsumption !== undefined) updateData.alcoholConsumption = data.alcoholConsumption;

  // 2. Detect if any fields actually changed compared to the database
  let hasChanged = false;
  const checkFields = [
    'firstName', 'lastName', 'gender', 'dateOfBirth', 'bloodType', 'zipCode',
    'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
    'allergies', 'medicalConditions', 'smokingStatus', 'alcoholConsumption'
  ];

  for (const key of checkFields) {
    if (updateData[key] !== undefined && String(updateData[key]) !== String(patient[key])) {
      hasChanged = true;
    }
  }

  // Numeric check for height
  if (updateData.heightCm !== undefined) {
    const currentHeight = patient.heightCm === null ? null : parseFloat(patient.heightCm);
    const newHeight = updateData.heightCm === null ? null : parseFloat(updateData.heightCm);
    if (newHeight !== currentHeight) {
      hasChanged = true;
    }
  }

  // Numeric check for weight
  if (updateData.weightKg !== undefined) {
    const currentWeight = patient.weightKg === null ? null : parseFloat(patient.weightKg);
    const newWeight = updateData.weightKg === null ? null : parseFloat(updateData.weightKg);
    if (newWeight !== currentWeight) {
      hasChanged = true;
    }
  }

  // 3. Return current DTO immediately if no fields changed
  if (!hasChanged) {
    logger.info(`Patient update requested but no fields changed for Patient ID ${patient.id}. Exiting early.`);
    return toPrivatePatientDto(patient);
  }

  // 4. Begin Transaction
  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 5. Update patient profile
    await patientRepository.updatePatientProfile(patient.id, updateData, transaction);
    logger.info(`Patient fields changed. Updating Patient ID ${patient.id}.`);

    // 6. Recalculate profile completion percentage using helper
    const mergedState = {
      ...patient.toJSON(),
      ...updateData
    };
    const completionPercentage = calculateProfileCompletion(mergedState);

    // 7. Update profile_completion_pct in database
    await patientRepository.updateProfileCompletion(patient.id, completionPercentage, transaction);

    // 8. Record PATIENT_PROFILE_UPDATED in activity logs
    await authRepository.insertActivityLog({
      userId: patient.id,
      action: PATIENT_PROFILE_UPDATED,
      module: 'Patient Management',
      entity: 'Patient',
      entityId: patient.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    // 9. Commit Transaction
    await transaction.commit();
    transactionFinished = true;

    // Fetch refreshed complete record to return in response
    const refreshedPatient = await patientRepository.findPatientByUserId(userId);
    return toPrivatePatientDto(refreshedPatient);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Patient profile update transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves doctor-safe patient details if and only if a valid connection is verified.
 * Otherwise, throws 404 to protect patient privacy.
 * @param {number|string} patientId - Patient ID
 * @param {number|string} doctorUserId - Doctor's user ID
 * @returns {Promise<object>} Doctor Patient DTO
 */
const getPatientForDoctor = async (patientId, doctorUserId) => {
  // Verify patient exists
  const patient = await patientRepository.findPatientById(patientId);
  if (!patient) {
    logger.warn(`Patient profile load failed: Patient ID ${patientId} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  // Validate doctor-patient clinical relationship
  const isPrimary = await patientRepository.findPrimaryDoctor(patientId, doctorUserId);
  const isAcceptedRequest = await patientRepository.findAcceptedDoctorRequest(patientId, doctorUserId);
  const hasAppointment = await patientRepository.findAppointment(patientId, doctorUserId);

  if (!isPrimary && !isAcceptedRequest && !hasAppointment) {
    logger.warn(`Doctor User ID ${doctorUserId} attempted to access unrelated Patient ID ${patientId}. Access denied.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  logger.info(`Doctor User ID ${doctorUserId} accessed patient profile for Patient ID ${patientId}.`);
  return toDoctorPatientDto(patient);
};

/**
 * Retrieves the complete profile of a patient for administrative purposes.
 * @param {number|string} id - Patient ID
 * @returns {Promise<object>} Private Patient DTO (Complete Profile)
 */
const getPatientForAdmin = async (id) => {
  const patient = await patientRepository.findPatientWithUser(id);
  if (!patient) {
    logger.warn(`Admin patient profile load failed: Patient ID ${id} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  logger.info(`Admin patient profile loaded successfully for Patient ID: ${id}`);
  return toPrivatePatientDto(patient);
};

/**
 * Retrieves list of patients based on role (Admin or Doctor).
 */
const getPatients = async (user) => {
  let patients = [];
  if (user.role === 'Admin') {
    patients = await patientRepository.findAllPatients();
  } else if (user.role === 'Doctor') {
    patients = await patientRepository.findPatientsForDoctor(user.id);
  } else {
    throw new ApiError(403, 'Unauthorized to view patients directory.');
  }

  return patients.map(p => toPrivatePatientDto(p));
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPatientForDoctor,
  getPatientForAdmin,
  getPatients
};
