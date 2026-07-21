/**
 * PulseCare AI - Vital Records Utility Functions
 */

import { VITAL_METRICS, TRIAGE_STATUS } from '../constants/vital.constants';

/**
 * Calculates Body Mass Index (BMI) from weight (kg) and height (cm)
 */
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

/**
 * Categorizes BMI value into clinical ranges
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return { label: 'Unknown', color: 'text-muted-foreground' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-500' };
  if (bmi <= 24.9) return { label: 'Normal Weight', color: 'text-emerald-500' };
  if (bmi <= 29.9) return { label: 'Overweight', color: 'text-amber-500' };
  return { label: 'Obese', color: 'text-rose-500' };
};

/**
 * Evaluates triage status for a single vital metric value
 */
export const evaluateMetricStatus = (metricKey, value) => {
  if (value === null || value === undefined || isNaN(value)) return TRIAGE_STATUS.NORMAL;
  const config = VITAL_METRICS[metricKey];
  if (!config || !config.normalRange) return TRIAGE_STATUS.NORMAL;

  const numVal = Number(value);
  const { normalRange, warningRange } = config;

  if (numVal >= normalRange.min && numVal <= normalRange.max) {
    return TRIAGE_STATUS.NORMAL;
  }

  if (warningRange && numVal >= warningRange.min && numVal <= warningRange.max) {
    return TRIAGE_STATUS.WARNING;
  }

  return TRIAGE_STATUS.CRITICAL;
};

/**
 * Determines overall triage status based on all present vitals in a record
 */
export const evaluateOverallTriage = (record) => {
  if (!record) return TRIAGE_STATUS.NORMAL;
  if (record.triageStatus) return record.triageStatus;

  const statuses = [
    evaluateMetricStatus('HEART_RATE', record.heartRate),
    evaluateMetricStatus('SYSTOLIC_BP', record.systolicBp),
    evaluateMetricStatus('DIASTOLIC_BP', record.diastolicBp),
    evaluateMetricStatus('OXYGEN_LEVEL', record.oxygenLevel),
    evaluateMetricStatus('TEMPERATURE', record.temperature),
  ];

  if (statuses.includes(TRIAGE_STATUS.CRITICAL)) return TRIAGE_STATUS.CRITICAL;
  if (statuses.includes(TRIAGE_STATUS.WARNING)) return TRIAGE_STATUS.WARNING;
  return TRIAGE_STATUS.NORMAL;
};

/**
 * Formats blood pressure string
 */
export const formatBP = (systolic, diastolic) => {
  if (!systolic || !diastolic) return 'N/A';
  return `${systolic}/${diastolic} mmHg`;
};

/**
 * Formats date display cleanly
 */
export const formatLoggedDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Filters vitals list by search term, date range, and triage status
 */
export const filterVitals = (vitals = [], { search = '', dateRange = 'all', status = 'all' } = {}) => {
  let result = [...vitals];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter((item) => {
      const patientName = `${item.patient?.firstName || ''} ${item.patient?.lastName || ''}`.toLowerCase();
      const notes = (item.notes || '').toLowerCase();
      const idStr = String(item.id || '');
      return patientName.includes(q) || notes.includes(q) || idStr.includes(q);
    });
  }

  // Date range filter
  if (dateRange && dateRange !== 'all') {
    const days = parseInt(dateRange, 10);
    if (!isNaN(days)) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((item) => new Date(item.loggedAt || item.createdAt) >= cutoff);
    }
  }

  // Triage status filter
  if (status && status !== 'all') {
    result = result.filter((item) => {
      const st = evaluateOverallTriage(item);
      return st.toLowerCase() === status.toLowerCase();
    });
  }

  return result;
};
