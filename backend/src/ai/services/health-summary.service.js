const healthSummaryRepository = require('../repositories/health-summary.repository');
const patientRepository = require('../../patient/repositories/patient.repository');
const doctorRepository = require('../../doctor/repositories/doctor.repository');
const { toHealthSummaryDto } = require('../dtos/health-summary.dto');
const {
  RISK_LEVEL,
  HEALTHY_PHYSIOLOGICAL_RANGES,
  CRITICAL_THRESHOLDS,
  RECOMMENDATIONS
} = require('../constants/ai.constants');
const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

/**
 * Validates that the doctor has a legitimate clinical relationship with the patient.
 */
const validateClinicalRelationship = async (patientId, doctorId) => {
  const isPrimary = await patientRepository.findPrimaryDoctor(patientId, doctorId);
  if (isPrimary) return true;

  const hasRequest = await patientRepository.findAcceptedDoctorRequest(patientId, doctorId);
  if (hasRequest) return true;

  const hasAppointment = await patientRepository.findAppointment(patientId, doctorId);
  return !!hasAppointment;
};

/**
 * Service to aggregate patient data and compute risk level & recommendations.
 */
const getPatientSummary = async (callerUserId, callerRole, patientId) => {
  // 1. Validate patient exists
  const patient = await healthSummaryRepository.findPatient(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient profile not found.');
  }

  // 2. Validate caller authorization
  if (callerRole === 'Patient') {
    if (Number(callerUserId) !== Number(patientId)) {
      throw new ApiError(403, 'You are not permitted to access this health summary.');
    }
  } else if (callerRole === 'Doctor') {
    const doctor = await doctorRepository.findDoctorByUserId(callerUserId);
    if (!doctor || !doctor.isVerified || (doctor.user && doctor.user.status !== 'Active')) {
      throw new ApiError(403, 'Your doctor account is not active or verified.');
    }
    const hasRelationship = await validateClinicalRelationship(patient.id, doctor.id);
    if (!hasRelationship) {
      logger.warn(`Doctor ID ${doctor.id} blocked from accessing health summary of patient ID ${patient.id}.`);
      throw new ApiError(403, 'You do not have a clinical relationship with this patient.');
    }
  } else if (callerRole !== 'Admin') {
    throw new ApiError(403, 'Unauthorized access.');
  }

  // 3. Load all required datasets
  const [
    latestVitals,
    activeAlerts,
    recentAppointments,
    recentPrescriptions,
    recentDoctorNotes
  ] = await Promise.all([
    healthSummaryRepository.findLatestVitals(patientId),
    healthSummaryRepository.findOpenAlerts(patientId),
    healthSummaryRepository.findRecentAppointments(patientId, 5),
    healthSummaryRepository.findRecentPrescriptions(patientId, 5),
    // Only retrieve doctor notes for doctor/admin, never patient
    callerRole !== 'Patient' ? healthSummaryRepository.findRecentDoctorNotes(patientId, 5) : null
  ]);

  // 4. Calculate BMI
  let latestBMI = null;
  const weight = latestVitals && latestVitals.weight ? latestVitals.weight : patient.weightKg;
  const height = patient.heightCm;
  if (weight && height && height > 0) {
    latestBMI = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  }

  // 5. Evaluate deterministic risk assessment
  const riskFactors = [];
  let abnormalVitalsCount = 0;
  let hasCriticalSpO2 = false;
  let hasCriticalBP = false;

  if (latestVitals) {
    // Heart Rate
    const hr = latestVitals.heartRate;
    if (hr < HEALTHY_PHYSIOLOGICAL_RANGES.HEART_RATE.min || hr > HEALTHY_PHYSIOLOGICAL_RANGES.HEART_RATE.max) {
      abnormalVitalsCount++;
      riskFactors.push(`Abnormal Heart Rate (${hr} bpm)`);
    }

    // SpO2
    const spo2 = latestVitals.oxygenLevel;
    if (spo2 !== null && spo2 !== undefined) {
      if (spo2 < CRITICAL_THRESHOLDS.SPO2) {
        hasCriticalSpO2 = true;
        abnormalVitalsCount++;
        riskFactors.push(`Critical SpO₂ (${spo2}%)`);
      } else if (spo2 < HEALTHY_PHYSIOLOGICAL_RANGES.SPO2.min) {
        abnormalVitalsCount++;
        riskFactors.push(`Low SpO₂ (${spo2}%)`);
      }
    }

    // Temperature
    const temp = latestVitals.temperature;
    if (temp < HEALTHY_PHYSIOLOGICAL_RANGES.TEMPERATURE.min || temp > HEALTHY_PHYSIOLOGICAL_RANGES.TEMPERATURE.max) {
      abnormalVitalsCount++;
      riskFactors.push(`Abnormal Temperature (${temp}°C)`);
    }

    // Blood Pressure
    const sys = latestVitals.systolicBp;
    const dia = latestVitals.diastolicBp;
    const isSysCritical = sys >= CRITICAL_THRESHOLDS.SYSTOLIC_BP_HIGH || sys < CRITICAL_THRESHOLDS.SYSTOLIC_BP_LOW;
    const isDiaCritical = dia >= CRITICAL_THRESHOLDS.DIASTOLIC_BP_HIGH || dia < CRITICAL_THRESHOLDS.DIASTOLIC_BP_LOW;
    if (isSysCritical || isDiaCritical) {
      hasCriticalBP = true;
      abnormalVitalsCount++;
      riskFactors.push(`Critical Blood Pressure (${sys}/${dia} mmHg)`);
    } else {
      const isSysAbnormal = sys < HEALTHY_PHYSIOLOGICAL_RANGES.SYSTOLIC_BP.min || sys > HEALTHY_PHYSIOLOGICAL_RANGES.SYSTOLIC_BP.max;
      const isDiaAbnormal = dia < HEALTHY_PHYSIOLOGICAL_RANGES.DIASTOLIC_BP.min || dia > HEALTHY_PHYSIOLOGICAL_RANGES.DIASTOLIC_BP.max;
      if (isSysAbnormal || isDiaAbnormal) {
        abnormalVitalsCount++;
        riskFactors.push(`Abnormal Blood Pressure (${sys}/${dia} mmHg)`);
      }
    }

    // Glucose
    const glucose = latestVitals.bloodGlucoseMgdl;
    if (glucose !== null && glucose !== undefined) {
      if (glucose < HEALTHY_PHYSIOLOGICAL_RANGES.GLUCOSE.min || glucose > HEALTHY_PHYSIOLOGICAL_RANGES.GLUCOSE.max) {
        abnormalVitalsCount++;
        riskFactors.push(`Abnormal Blood Glucose (${glucose} mg/dL)`);
      }
    }
  }

  // BMI Risk Check
  if (latestBMI !== null) {
    if (latestBMI > 30) {
      riskFactors.push(`Obesity (BMI: ${latestBMI})`);
    } else if (latestBMI >= 25 && latestBMI <= 30) {
      riskFactors.push(`Overweight (BMI: ${latestBMI})`);
    } else if (latestBMI < 18.5) {
      riskFactors.push(`Underweight (BMI: ${latestBMI})`);
    }
  }

  // Alerts Check
  const alertsCount = activeAlerts ? activeAlerts.length : 0;
  if (alertsCount > 0) {
    riskFactors.push(`${alertsCount} Active Vital Alert(s)`);
  }

  // Determine Overall Risk Level
  let riskLevel = RISK_LEVEL.LOW;
  const hasHighRiskTriggers =
    abnormalVitalsCount >= 2 ||
    alertsCount >= 2 ||
    (latestBMI !== null && latestBMI > 30) ||
    hasCriticalBP ||
    hasCriticalSpO2;

  const hasMediumRiskTriggers =
    abnormalVitalsCount === 1 ||
    alertsCount === 1 ||
    (latestBMI !== null && latestBMI >= 25 && latestBMI <= 30);

  if (hasHighRiskTriggers) {
    riskLevel = RISK_LEVEL.HIGH;
  } else if (hasMediumRiskTriggers) {
    riskLevel = RISK_LEVEL.MEDIUM;
  }

  // 6. Recommendation Engine (array of recommendation recommendations)
  const recommendations = [];
  if (hasCriticalSpO2) {
    recommendations.push(RECOMMENDATIONS.CRITICAL_SPO2);
  }
  if (hasCriticalBP) {
    recommendations.push(RECOMMENDATIONS.CRITICAL_BP);
  }
  if (latestBMI !== null && latestBMI > 30) {
    recommendations.push(RECOMMENDATIONS.HIGH_BMI);
  }

  // Fallback / standard recommendations
  if (recommendations.length === 0) {
    if (riskLevel === RISK_LEVEL.MEDIUM || riskFactors.length > 0) {
      recommendations.push('Schedule doctor consultation.');
    } else {
      recommendations.push(RECOMMENDATIONS.NORMAL);
    }
  }

  return toHealthSummaryDto({
    patient,
    latestVitals,
    latestBMI,
    activeAlerts,
    recentAppointments,
    recentPrescriptions,
    recentDoctorNotes,
    riskLevel,
    riskFactors,
    recommendations
  });
};

module.exports = {
  getPatientSummary
};
