/**
 * PulseCare AI - Health Summary Module Constants
 */

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const RISK_CONFIG = {
  [RISK_LEVELS.LOW]: {
    label: 'Low Risk',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    ringColor: '#10b981',
    progress: 25,
    icon: 'CheckCircle2',
    description: 'Patient vital metrics are stable within physiological reference ranges.',
    color: 'emerald',
  },
  [RISK_LEVELS.MEDIUM]: {
    label: 'Medium Risk',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    ringColor: '#f59e0b',
    progress: 50,
    icon: 'AlertTriangle',
    description: 'Mild physiological deviations or single abnormal vital reading detected.',
    color: 'amber',
  },
  [RISK_LEVELS.HIGH]: {
    label: 'High Risk',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    ringColor: '#f97316',
    progress: 75,
    icon: 'AlertOctagon',
    description: 'Multiple abnormal vitals or elevated health risk triggers identified.',
    color: 'orange',
  },
  [RISK_LEVELS.CRITICAL]: {
    label: 'Critical Risk',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse',
    ringColor: '#f43f5e',
    progress: 95,
    icon: 'ShieldAlert',
    description: 'Critical vital readings require immediate clinical attention and intervention.',
    color: 'rose',
  },
};

export const AI_DISCLAIMER =
  'AI-generated content is advisory and must not replace professional medical judgment. All clinical decisions should be verified by a qualified healthcare professional.';

export const TIMELINE_EVENT_TYPES = {
  ALL: 'ALL',
  APPOINTMENT: 'APPOINTMENT',
  PRESCRIPTION: 'PRESCRIPTION',
  DOCTOR_NOTE: 'DOCTOR_NOTE',
  VITALS_UPDATE: 'VITALS_UPDATE',
  AI_SUMMARY_GENERATED: 'AI_SUMMARY_GENERATED',
  MEDICATION_UPDATE: 'MEDICATION_UPDATE',
};

export const TIMELINE_EVENT_CONFIG = {
  [TIMELINE_EVENT_TYPES.APPOINTMENT]: {
    label: 'Appointment',
    icon: 'Calendar',
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  [TIMELINE_EVENT_TYPES.PRESCRIPTION]: {
    label: 'Prescription',
    icon: 'Pill',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  [TIMELINE_EVENT_TYPES.DOCTOR_NOTE]: {
    label: 'Doctor Note',
    icon: 'FileText',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  [TIMELINE_EVENT_TYPES.VITALS_UPDATE]: {
    label: 'Vitals Update',
    icon: 'Activity',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  [TIMELINE_EVENT_TYPES.AI_SUMMARY_GENERATED]: {
    label: 'AI Summary Generated',
    icon: 'Sparkles',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  [TIMELINE_EVENT_TYPES.MEDICATION_UPDATE]: {
    label: 'Medication Update',
    icon: 'HeartPulse',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
};

export const RECOMMENDATION_PRIORITIES = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const RECOMMENDATION_CONFIG = {
  [RECOMMENDATION_PRIORITIES.HIGH]: {
    label: 'High Priority',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: 'AlertCircle',
  },
  [RECOMMENDATION_PRIORITIES.MEDIUM]: {
    label: 'Medium Priority',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: 'Clock',
  },
  [RECOMMENDATION_PRIORITIES.LOW]: {
    label: 'Routine Suggestion',
    badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    icon: 'Info',
  },
};

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last 1 Year' },
];

export const VITAL_METRIC_CONFIG = {
  systolicBp: { label: 'Blood Pressure', unit: 'mmHg', normal: '90-120 / 60-80' },
  heartRate: { label: 'Heart Rate', unit: 'BPM', normal: '60 - 100' },
  bloodGlucoseMgdl: { label: 'Blood Glucose', unit: 'mg/dL', normal: '70 - 140' },
  temperature: { label: 'Temperature', unit: '°F', normal: '97.0 - 99.0' },
  weight: { label: 'Weight', unit: 'kg', normal: 'BMI 18.5 - 24.9' },
  oxygenLevel: { label: 'SpO₂ Oxygen', unit: '%', normal: '95 - 100' },
  bmi: { label: 'BMI Index', unit: 'kg/m²', normal: '18.5 - 24.9' },
};
