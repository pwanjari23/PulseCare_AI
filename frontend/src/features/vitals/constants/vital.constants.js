/**
 * PulseCare AI - Vital Records Management Constants
 */

export const VITAL_METRICS = {
  HEART_RATE: {
    key: 'heartRate',
    label: 'Heart Rate',
    unit: 'BPM',
    min: 30,
    max: 220,
    normalRange: { min: 60, max: 100 },
    warningRange: { min: 50, max: 120 },
    color: 'rose',
    hex: '#f43f5e',
  },
  SYSTOLIC_BP: {
    key: 'systolicBp',
    label: 'Systolic BP',
    unit: 'mmHg',
    min: 70,
    max: 250,
    normalRange: { min: 90, max: 120 },
    warningRange: { min: 85, max: 140 },
    color: 'sky',
    hex: '#0284c7',
  },
  DIASTOLIC_BP: {
    key: 'diastolicBp',
    label: 'Diastolic BP',
    unit: 'mmHg',
    min: 40,
    max: 150,
    normalRange: { min: 60, max: 80 },
    warningRange: { min: 55, max: 90 },
    color: 'blue',
    hex: '#2563eb',
  },
  OXYGEN_LEVEL: {
    key: 'oxygenLevel',
    label: 'SpO₂ Saturation',
    unit: '%',
    min: 70,
    max: 100,
    normalRange: { min: 95, max: 100 },
    warningRange: { min: 92, max: 94 },
    color: 'teal',
    hex: '#0d9488',
  },
  TEMPERATURE: {
    key: 'temperature',
    label: 'Body Temperature',
    unit: '°F', // or °C based on display, normalized in backend
    min: 90,
    max: 110,
    normalRange: { min: 97.0, max: 99.5 },
    warningRange: { min: 96.0, max: 101.0 },
    color: 'amber',
    hex: '#d97706',
  },
  RESPIRATORY_RATE: {
    key: 'respiratoryRate',
    label: 'Respiratory Rate',
    unit: 'breaths/min',
    min: 8,
    max: 60,
    normalRange: { min: 12, max: 20 },
    warningRange: { min: 10, max: 24 },
    color: 'purple',
    hex: '#9333ea',
  },
  BLOOD_GLUCOSE: {
    key: 'bloodGlucoseMgdl',
    label: 'Blood Glucose',
    unit: 'mg/dL',
    min: 40,
    max: 500,
    normalRange: { min: 70, max: 140 },
    warningRange: { min: 65, max: 180 },
    color: 'emerald',
    hex: '#059669',
  },
  WEIGHT: {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    min: 2,
    max: 300,
    color: 'indigo',
    hex: '#4f46e5',
  },
  HEIGHT: {
    key: 'height',
    label: 'Height',
    unit: 'cm',
    min: 30,
    max: 250,
    color: 'cyan',
    hex: '#0891b2',
  },
  PAIN_LEVEL: {
    key: 'painLevel',
    label: 'Pain Score',
    unit: '/10',
    min: 0,
    max: 10,
    normalRange: { min: 0, max: 3 },
    warningRange: { min: 4, max: 6 },
    color: 'orange',
    hex: '#ea580c',
  },
};

export const TRIAGE_STATUS = {
  NORMAL: 'Normal',
  WARNING: 'Warning',
  CRITICAL: 'Critical',
};

export const TRIAGE_CONFIG = {
  Normal: {
    label: 'Normal',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    bgClass: 'bg-emerald-500/5',
    borderClass: 'border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  Warning: {
    label: 'Warning',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    bgClass: 'bg-amber-500/5',
    borderClass: 'border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  Critical: {
    label: 'Critical',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    bgClass: 'bg-rose-500/5',
    borderClass: 'border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
};

export const BLOOD_GLUCOSE_TYPES = [
  { value: 'Fasting', label: 'Fasting (Before Meal)' },
  { value: 'Random', label: 'Random / Spot Check' },
  { value: 'Post-Meal', label: 'Post-Meal (2 Hours After)' },
];

export const VITAL_SOURCES = [
  { value: 'Manual', label: 'Manual Input' },
  { value: 'Bluetooth', label: 'Bluetooth Device' },
  { value: 'Wearable', label: 'Smart Wearable' },
  { value: 'Imported', label: 'EHR Import' },
];

export const DATE_RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];
