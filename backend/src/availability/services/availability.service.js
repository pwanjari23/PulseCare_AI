const { sequelize } = require('#models/index.js');
const availabilityRepository = require('../repositories/availability.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const { dayStringToNumeric, calculateDurationMinutes } = require('../constants/availability.constants');
const { toPrivateAvailabilityDto, toPublicAvailabilityDto } = require('../dtos/availability.dto');
const {
  DOCTOR_AVAILABILITY_CREATED,
  DOCTOR_AVAILABILITY_UPDATED,
  DOCTOR_AVAILABILITY_DISABLED,
  DOCTOR_AVAILABILITY_DELETED
} = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Normalizes HH:mm time representation to HH:mm:ss for DB comparison.
 */
const normalizeTime = (t) => {
  if (!t) return null;
  return t.length === 5 ? `${t}:00` : t;
};

/**
 * Creates availability schedule block.
 */
const createAvailability = async (doctorUserId, data, metadata = {}) => {
  const doctor = await doctorRepository.findDoctorWithSpecialization(doctorUserId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor profile not found.');
  }

  // Doctor status and verification check
  if (!doctor.user || doctor.user.status !== 'Active') {
    throw new ApiError(403, 'Doctor account is inactive.');
  }
  if (!doctor.isVerified) {
    throw new ApiError(400, 'Doctor is not verified.');
  }

  const dayVal = dayStringToNumeric(data.dayOfWeek);
  const normalizedStart = normalizeTime(data.startTime);
  const normalizedEnd = normalizeTime(data.endTime);

  // Check overlapping
  const overlap = await availabilityRepository.checkOverlappingAvailability(
    doctor.id,
    dayVal,
    normalizedStart,
    normalizedEnd
  );
  if (overlap) {
    throw new ApiError(409, 'Availability slot overlaps with an existing schedule.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    const record = await availabilityRepository.createAvailability({
      doctorId: doctor.id,
      dayOfWeek: dayVal,
      startTime: normalizedStart,
      endTime: normalizedEnd,
      isAvailable: true
    }, transaction);

    // Audit log
    await authRepository.insertActivityLog({
      userId: doctorUserId,
      action: DOCTOR_AVAILABILITY_CREATED,
      module: 'Doctor Availability',
      entity: 'DoctorAvailability',
      entityId: record.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    return toPrivateAvailabilityDto(record);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Create availability transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Updates availability schedule block.
 */
const updateAvailability = async (doctorUserId, id, data, metadata = {}) => {
  const record = await availabilityRepository.findAvailabilityById(id);
  if (!record) {
    throw new ApiError(404, 'Availability record not found.');
  }

  if (record.doctorId !== doctorUserId) {
    throw new ApiError(403, 'You are not authorized to update this availability record.');
  }

  const dayVal = dayStringToNumeric(data.dayOfWeek);
  const normalizedStart = normalizeTime(data.startTime);
  const normalizedEnd = normalizeTime(data.endTime);

  // Skip DB write if nothing changed
  if (record.dayOfWeek === dayVal && record.startTime === normalizedStart && record.endTime === normalizedEnd) {
    return toPrivateAvailabilityDto(record);
  }

  // Check overlap excluding itself
  const overlap = await availabilityRepository.checkOverlappingAvailability(
    doctorUserId,
    dayVal,
    normalizedStart,
    normalizedEnd,
    id
  );
  if (overlap) {
    throw new ApiError(409, 'Availability slot overlaps with an existing schedule.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await availabilityRepository.updateAvailability(id, {
      dayOfWeek: dayVal,
      startTime: normalizedStart,
      endTime: normalizedEnd
    }, transaction);

    await authRepository.insertActivityLog({
      userId: doctorUserId,
      action: DOCTOR_AVAILABILITY_UPDATED,
      module: 'Doctor Availability',
      entity: 'DoctorAvailability',
      entityId: id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await availabilityRepository.findAvailabilityById(id);
    return toPrivateAvailabilityDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Update availability transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Disables availability block.
 */
const disableAvailability = async (doctorUserId, id, metadata = {}) => {
  const record = await availabilityRepository.findAvailabilityById(id);
  if (!record) {
    throw new ApiError(404, 'Availability record not found.');
  }

  if (record.doctorId !== doctorUserId) {
    throw new ApiError(403, 'You are not authorized to disable this availability record.');
  }

  // Skip if already disabled
  if (!record.isAvailable) {
    return toPrivateAvailabilityDto(record);
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await availabilityRepository.disableAvailability(id, transaction);

    await authRepository.insertActivityLog({
      userId: doctorUserId,
      action: DOCTOR_AVAILABILITY_DISABLED,
      module: 'Doctor Availability',
      entity: 'DoctorAvailability',
      entityId: id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const refreshed = await availabilityRepository.findAvailabilityById(id);
    return toPrivateAvailabilityDto(refreshed);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Disable availability transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Soft deletes availability block.
 */
const deleteAvailability = async (doctorUserId, id, metadata = {}) => {
  const record = await availabilityRepository.findAvailabilityById(id);
  if (!record) {
    throw new ApiError(404, 'Availability record not found.');
  }

  if (record.doctorId !== doctorUserId) {
    throw new ApiError(403, 'You are not authorized to delete this availability record.');
  }

  // Future appointment dependency check
  const hasFuture = await availabilityRepository.hasFutureAppointments(
    doctorUserId,
    record.dayOfWeek,
    record.startTime,
    record.endTime
  );
  if (hasFuture) {
    throw new ApiError(409, 'Cannot delete availability because future appointments depend on it.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await availabilityRepository.softDeleteAvailability(id, transaction);

    await authRepository.insertActivityLog({
      userId: doctorUserId,
      action: DOCTOR_AVAILABILITY_DELETED,
      module: 'Doctor Availability',
      entity: 'DoctorAvailability',
      entityId: id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;
    return true;
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Delete availability transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Gets all availability records for authenticated doctor.
 */
const getMyAvailability = async (doctorUserId) => {
  const list = await availabilityRepository.findDoctorAvailability(doctorUserId);
  return list.map(toPrivateAvailabilityDto);
};

/**
 * Public lookup: Gets verified, active availability.
 */
const getDoctorAvailability = async (doctorId) => {
  const doctor = await doctorRepository.findDoctorWithSpecialization(doctorId);
  if (!doctor || !doctor.user || doctor.user.status !== 'Active' || !doctor.isVerified) {
    throw new ApiError(404, 'Doctor availability not found.');
  }

  const list = await availabilityRepository.findPublicAvailability(doctorId);
  return list.map(toPublicAvailabilityDto);
};

module.exports = {
  createAvailability,
  updateAvailability,
  disableAvailability,
  deleteAvailability,
  getMyAvailability,
  getDoctorAvailability
};
