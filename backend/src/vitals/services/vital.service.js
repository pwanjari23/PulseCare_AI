const { sequelize, DoctorRequest, Appointment, Doctor, Patient, VitalsAlert } = require('#models/index.js');
const vitalRepository = require('../repositories/vital.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const authRepository = require('../../auth/repositories/auth.repository');
const notificationService = require('../../notification/services/notification.service');
const { HEALTHY_RANGES } = require('../constants/vital.constants');
const { toVitalDto } = require('../dtos/vital.dto');
const {
  VITAL_RECORDED,
  VITAL_UPDATED,
  VITAL_DELETED,
  VITAL_ALERT_CREATED
} = require('#constants/activity.constants.js');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Checks if a vital reading is outside healthy ranges.
 */
const isOutsideRange = (value, range) => {
  if (value === undefined || value === null) return false;
  return value < range.min || value > range.max;
};

/**
 * Evaluates vital sign metrics against healthy ranges.
 */
const evaluateAlertConditions = (metrics) => {
  const hrAlert = isOutsideRange(metrics.heartRate, HEALTHY_RANGES.HEART_RATE);
  const spo2Alert = isOutsideRange(metrics.spo2, HEALTHY_RANGES.SPO2);
  const tempAlert = isOutsideRange(metrics.temperature, HEALTHY_RANGES.TEMPERATURE);
  const sysAlert = isOutsideRange(metrics.systolicBp, HEALTHY_RANGES.SYSTOLIC_BP);
  const diaAlert = isOutsideRange(metrics.diastolicBp, HEALTHY_RANGES.DIASTOLIC_BP);
  const glucAlert = isOutsideRange(metrics.glucose, HEALTHY_RANGES.GLUCOSE);
  const bmiAlert = isOutsideRange(metrics.bmi, HEALTHY_RANGES.BMI);

  return hrAlert || spo2Alert || tempAlert || sysAlert || diaAlert || glucAlert || bmiAlert;
};

/**
 * Finds a suitable doctor to associate a vital alert with.
 */
const findDoctorForAlert = async (patient, transaction) => {
  if (patient.primaryDoctorId) return patient.primaryDoctorId;

  const request = await DoctorRequest.findOne({
    where: { patientId: patient.id, status: 'Accepted' },
    transaction
  });
  if (request) return request.doctorId;

  const app = await Appointment.findOne({
    where: { patientId: patient.id },
    transaction
  });
  if (app) return app.doctorId;

  const firstDoc = await Doctor.findOne({
    where: { isVerified: true },
    transaction
  });
  return firstDoc ? firstDoc.id : null;
};

/**
 * Verifies if a doctor has an active connection with a patient.
 */
const checkDoctorConnection = async (doctorId, patientId) => {
  const patient = await Patient.findByPk(patientId);
  if (patient && patient.primaryDoctorId === doctorId) return true;

  const request = await DoctorRequest.findOne({
    where: { patientId, doctorId, status: 'Accepted' }
  });
  if (request) return true;

  const app = await Appointment.findOne({
    where: { patientId, doctorId }
  });
  if (app) return true;

  return false;
};

/**
 * Logs vital readings for the patient.
 */
const recordVital = async (patientUserId, data, metadata = {}) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    logger.warn(`Vital record failed: Patient ${patientUserId} not found.`);
    throw new ApiError(404, 'Patient profile not found.');
  }

  // Calculate BMI dynamically
  const height = data.heightCm || patient.heightCm;
  const weight = data.weightKg || patient.weightKg;
  const bmi = (weight && height) ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : null;

  // Evaluate alerts
  const alertGenerated = evaluateAlertConditions({
    heartRate: data.heartRate,
    spo2: data.spo2,
    temperature: data.temperature,
    systolicBp: data.systolicBp,
    diastolicBp: data.diastolicBp,
    glucose: data.glucose,
    bmi
  });

  const triageStatus = alertGenerated ? 'Warning' : 'Normal';
  const recordedTime = data.recordedAt ? new Date(data.recordedAt) : new Date();

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    // 1. Create vital log
    const log = await vitalRepository.createVital({
      patientId: patient.id,
      heartRate: data.heartRate,
      oxygenLevel: data.spo2,
      temperature: data.temperature,
      systolicBp: data.systolicBp,
      diastolicBp: data.diastolicBp,
      bloodGlucoseMgdl: data.glucose || null,
      weight: data.weightKg || null,
      loggedAt: recordedTime,
      triageStatus,
      source: 'Manual'
    }, transaction);

    // 2. Alert creation if values are abnormal
    if (alertGenerated) {
      const doctorId = await findDoctorForAlert(patient, transaction);
      if (doctorId) {
        const alertRecord = await vitalRepository.createAlert({
          patientId: patient.id,
          vitalsLogId: log.id,
          doctorId,
          alertType: 'Warning',
          status: 'Open'
        }, transaction);

        // Activity log alert
        await authRepository.insertActivityLog({
          userId: patient.id,
          action: VITAL_ALERT_CREATED,
          module: 'Vitals Management',
          entity: 'VitalsAlert',
          entityId: log.id,
          ipAddress: metadata.ipAddress || '127.0.0.1',
          userAgent: metadata.userAgent || 'Unknown',
          created_at: new Date()
        }, transaction);

        // Create notifications for patient and doctor
        await notificationService.createManyNotifications([
          {
            recipientId: patient.id,
            title: 'Vital Alert',
            message: 'One or more of your vital readings are outside healthy ranges. Please consult your doctor.',
            type: 'VitalAlert',
            payload: { vitalId: log.id, alertId: alertRecord.id }
          },
          {
            recipientId: doctorId,
            title: 'Patient Vital Alert',
            message: `Patient ${patient.firstName} ${patient.lastName} has abnormal vital readings requiring attention.`,
            type: 'VitalAlert',
            payload: { vitalId: log.id, alertId: alertRecord.id }
          }
        ], transaction);
      }
    }

    // 3. Update patient details to support BMI & timestamp tracking
    const updateFields = { lastVitalSubmittedAt: recordedTime };
    if (data.heightCm) updateFields.heightCm = data.heightCm;
    if (data.weightKg) updateFields.weightKg = data.weightKg;
    await Patient.update(updateFields, { where: { id: patient.id }, transaction });

    // 4. Activity log recording
    await authRepository.insertActivityLog({
      userId: patient.id,
      action: VITAL_RECORDED,
      module: 'Vitals Management',
      entity: 'VitalsLog',
      entityId: log.id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const completeRecord = await vitalRepository.findVitalById(log.id);
    return toVitalDto(completeRecord, alertGenerated, height);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Record vital transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Updates vital signs logs.
 */
const updateVital = async (patientUserId, id, data, metadata = {}) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }

  const log = await vitalRepository.findVitalById(id);
  if (!log) {
    throw new ApiError(404, 'Vital record not found.');
  }

  if (log.patientId !== patient.id) {
    throw new ApiError(403, 'You are not authorized to update this vital record.');
  }

  const height = data.heightCm || patient.heightCm;
  const weight = data.weightKg !== undefined ? data.weightKg : log.weight;
  const bmi = (weight && height) ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : null;

  const alertGenerated = evaluateAlertConditions({
    heartRate: data.heartRate !== undefined ? data.heartRate : log.heartRate,
    spo2: data.spo2 !== undefined ? data.spo2 : log.oxygenLevel,
    temperature: data.temperature !== undefined ? data.temperature : log.temperature,
    systolicBp: data.systolicBp !== undefined ? data.systolicBp : log.systolicBp,
    diastolicBp: data.diastolicBp !== undefined ? data.diastolicBp : log.diastolicBp,
    glucose: data.glucose !== undefined ? data.glucose : log.bloodGlucoseMgdl,
    bmi
  });

  const triageStatus = alertGenerated ? 'Warning' : 'Normal';

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await vitalRepository.updateVital(id, {
      heartRate: data.heartRate,
      oxygenLevel: data.spo2,
      temperature: data.temperature,
      systolicBp: data.systolicBp,
      diastolicBp: data.diastolicBp,
      bloodGlucoseMgdl: data.glucose || null,
      weight: data.weightKg || null,
      triageStatus
    }, transaction);

    // Evaluate alert adjustments
    if (alertGenerated && !log.alert) {
      const doctorId = await findDoctorForAlert(patient, transaction);
      if (doctorId) {
        const alertRecord = await vitalRepository.createAlert({
          patientId: patient.id,
          vitalsLogId: id,
          doctorId,
          alertType: 'Warning',
          status: 'Open'
        }, transaction);

        await authRepository.insertActivityLog({
          userId: patient.id,
          action: VITAL_ALERT_CREATED,
          module: 'Vitals Management',
          entity: 'VitalsAlert',
          entityId: id,
          ipAddress: metadata.ipAddress || '127.0.0.1',
          userAgent: metadata.userAgent || 'Unknown',
          created_at: new Date()
        }, transaction);

        // Create notifications for patient and doctor
        await notificationService.createManyNotifications([
          {
            recipientId: patient.id,
            title: 'Vital Alert',
            message: 'One or more of your updated vital readings are outside healthy ranges. Please consult your doctor.',
            type: 'VitalAlert',
            payload: { vitalId: id, alertId: alertRecord.id }
          },
          {
            recipientId: doctorId,
            title: 'Patient Vital Alert',
            message: `Patient ${patient.firstName} ${patient.lastName} has abnormal vital readings requiring attention.`,
            type: 'VitalAlert',
            payload: { vitalId: id, alertId: alertRecord.id }
          }
        ], transaction);
      }
    } else if (!alertGenerated && log.alert) {
      await VitalsAlert.destroy({ where: { vitalsLogId: id }, transaction });
    }

    // Activity log update
    await authRepository.insertActivityLog({
      userId: patient.id,
      action: VITAL_UPDATED,
      module: 'Vitals Management',
      entity: 'VitalsLog',
      entityId: id,
      ipAddress: metadata.ipAddress || '127.0.0.1',
      userAgent: metadata.userAgent || 'Unknown',
      created_at: new Date()
    }, transaction);

    await transaction.commit();
    transactionFinished = true;

    const completeRecord = await vitalRepository.findVitalById(id);
    return toVitalDto(completeRecord, alertGenerated, height);
  } catch (error) {
    if (!transactionFinished) {
      logger.error(`Update vital transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Deletes a vital signs record.
 */
const deleteVital = async (patientUserId, id, metadata = {}) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }

  const log = await vitalRepository.findVitalById(id);
  if (!log) {
    throw new ApiError(404, 'Vital record not found.');
  }

  if (log.patientId !== patient.id) {
    throw new ApiError(403, 'You are not authorized to delete this vital record.');
  }

  let transactionFinished = false;
  const transaction = await sequelize.transaction();
  try {
    await vitalRepository.deleteVital(id, transaction);

    await authRepository.insertActivityLog({
      userId: patient.id,
      action: VITAL_DELETED,
      module: 'Vitals Management',
      entity: 'VitalsLog',
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
      logger.error(`Delete vital transaction rolled back. Reason: ${error.message}`);
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves history list of patient vitals.
 */
const getPatientVitals = async (userId, userRole, targetPatientId) => {
  if (userRole === 'Patient') {
    if (userId !== targetPatientId) {
      throw new ApiError(403, 'You are not authorized to view these vitals.');
    }
  } else if (userRole === 'Doctor') {
    const isConnected = await checkDoctorConnection(userId, targetPatientId);
    if (!isConnected) {
      throw new ApiError(403, 'You are not authorized to view this patient\'s vitals.');
    }
  }

  const list = await vitalRepository.findPatientVitals(targetPatientId);
  return list.map(log => toVitalDto(log));
};

/**
 * Retrieves the latest recorded vital for the patient.
 */
const getLatestVital = async (patientUserId) => {
  const patient = await patientRepository.findPatientByUserId(patientUserId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }
  const log = await vitalRepository.findLatestVital(patient.id);
  return toVitalDto(log);
};

module.exports = {
  recordVital,
  updateVital,
  deleteVital,
  getPatientVitals,
  getLatestVital
};
