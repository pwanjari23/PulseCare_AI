/**
 * Maps a Sequelize VitalsLog record to the sanitized Vital DTO.
 * Dynamically calculates BMI if weight and height are present.
 *
 * @param {object} log - Sequelize VitalsLog instance
 * @param {boolean} [alertGenerated] - Manually specify if alert was created
 * @param {number} [heightCm] - Patient's height for BMI calculation
 * @returns {object} Sanitized Vital DTO
 */
const toVitalDto = (log, alertGenerated = undefined, heightCm = null) => {
  if (!log) return null;

  const height = heightCm || (log.patient ? log.patient.heightCm : null);
  const weight = log.weight ? Number(log.weight) : null;
  const bmi = (weight && height) ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : null;
  const isAlert = alertGenerated !== undefined ? alertGenerated : (log.alert !== undefined ? !!log.alert : false);

  return {
    id: log.id,
    patientId: log.patientId,
    recordedAt: log.loggedAt,
    heartRate: log.heartRate,
    spo2: log.oxygenLevel ? Number(log.oxygenLevel) : null,
    temperature: log.temperature ? Number(log.temperature) : null,
    systolicBp: log.systolicBp,
    diastolicBp: log.diastolicBp,
    glucose: log.bloodGlucoseMgdl ? Number(log.bloodGlucoseMgdl) : null,
    weightKg: weight,
    bmi,
    alertGenerated: isAlert,
    createdAt: log.createdAt
  };
};

module.exports = {
  toVitalDto
};
