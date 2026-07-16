/**
 * AI Health Summary & Risk Assessment Constants
 */
const RISK_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

// Physiological ranges for normal healthy status
const HEALTHY_PHYSIOLOGICAL_RANGES = {
  HEART_RATE: { min: 60, max: 100 },      // Normal heart rate: 60 - 100 bpm
  SPO2: { min: 95, max: 100 },             // Normal SpO2: 95% - 100%
  TEMPERATURE: { min: 36.0, max: 37.5 },   // Normal Temp: 36.0 - 37.5 C
  SYSTOLIC_BP: { min: 90, max: 120 },      // Normal Systolic: 90 - 120 mmHg
  DIASTOLIC_BP: { min: 60, max: 80 },      // Normal Diastolic: 60 - 80 mmHg
  GLUCOSE: { min: 70, max: 140 }           // Normal Fasting/Random Glucose: 70 - 140 mg/dL
};

// Critical threshold limits for triggering immediate HIGH risk
const CRITICAL_THRESHOLDS = {
  SPO2: 90,                                // Critical SpO2 < 90%
  SYSTOLIC_BP_HIGH: 140,                   // Critical Systolic >= 140 (Stage 2 Hypertension)
  SYSTOLIC_BP_LOW: 90,                     // Critical Systolic < 90
  DIASTOLIC_BP_HIGH: 90,                   // Critical Diastolic >= 90
  DIASTOLIC_BP_LOW: 60                     // Critical Diastolic < 60
};

// Recommendations messages
const RECOMMENDATIONS = {
  CRITICAL_SPO2: 'Seek immediate medical attention.',
  CRITICAL_BP: 'Schedule doctor consultation.',
  HIGH_BMI: 'Lifestyle modification recommended.',
  NORMAL: 'Continue regular monitoring.'
};

module.exports = {
  RISK_LEVEL,
  HEALTHY_PHYSIOLOGICAL_RANGES,
  CRITICAL_THRESHOLDS,
  RECOMMENDATIONS
};
