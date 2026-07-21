/**
 * PulseCare AI - Reports & Analytics Constants
 */

export const REPORT_TYPES = {
  OVERVIEW: 'OVERVIEW',
  USERS: 'USERS',
  APPOINTMENTS: 'APPOINTMENTS',
  DOCTORS: 'DOCTORS',
  PATIENTS: 'PATIENTS',
  PRESCRIPTIONS: 'PRESCRIPTIONS',
  HEALTH_SUMMARY: 'HEALTH_SUMMARY',
  ACTIVITY: 'ACTIVITY',
};

export const REPORT_CONFIG = {
  [REPORT_TYPES.OVERVIEW]: {
    title: 'Platform Reports & Analytics Overview',
    description: 'Executive analytical summary of platform performance, growth, & telemetry',
    icon: 'BarChart3',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
  },
  [REPORT_TYPES.USERS]: {
    title: 'User Ecosystem Analytics Report',
    description: 'User registration growth, demographics, & engagement breakdown',
    icon: 'Users',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  },
  [REPORT_TYPES.APPOINTMENTS]: {
    title: 'Appointment Throughput Report',
    description: 'Consultation volume, completion rates, & cancellation telemetry',
    icon: 'Calendar',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  [REPORT_TYPES.DOCTORS]: {
    title: 'Doctor Performance Analytics',
    description: 'Physician consultation throughput, patient satisfaction, & response time',
    icon: 'Stethoscope',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  [REPORT_TYPES.PATIENTS]: {
    title: 'Patient Population & Health Telemetry',
    description: 'Patient demographics, vital sign trends, & monitoring engagement',
    icon: 'User',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  [REPORT_TYPES.PRESCRIPTIONS]: {
    title: 'Prescription & Medication Report',
    description: 'Prescription volume, common diagnoses, & medication distribution',
    icon: 'FileText',
    badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  [REPORT_TYPES.HEALTH_SUMMARY]: {
    title: 'AI Health Assessment Intelligence Report',
    description: 'AI summary generation stats, clinical risk distribution, & processing times',
    icon: 'Sparkles',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  [REPORT_TYPES.ACTIVITY]: {
    title: 'System Activity & Audit Log Report',
    description: 'Comprehensive audit trail of platform events, registrations, & alerts',
    icon: 'Activity',
    badgeClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  },
};

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last 1 Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const EXPORT_FORMATS = {
  CSV: 'CSV',
  PDF: 'PDF',
};
