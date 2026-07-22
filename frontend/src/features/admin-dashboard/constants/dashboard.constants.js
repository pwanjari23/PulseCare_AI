/**
 * PulseCare AI - Admin Dashboard Constants
 */

export const DATE_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last 1 Year' },
];

export const SYSTEM_HEALTH_STATUS = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  CRITICAL: 'CRITICAL',
};

export const SYSTEM_HEALTH_CONFIG = {
  [SYSTEM_HEALTH_STATUS.HEALTHY]: {
    label: 'Operational',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  [SYSTEM_HEALTH_STATUS.DEGRADED]: {
    label: 'Degraded Performance',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  [SYSTEM_HEALTH_STATUS.CRITICAL]: {
    label: 'System Disruption',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse',
    dotClass: 'bg-rose-500',
  },
};

export const ACTIVITY_TYPES = {
  PATIENT_REGISTERED: 'PATIENT_REGISTERED',
  DOCTOR_APPROVED: 'DOCTOR_APPROVED',
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  PRESCRIPTION_ADDED: 'PRESCRIPTION_ADDED',
  DOCTOR_NOTE_CREATED: 'DOCTOR_NOTE_CREATED',
  AI_SUMMARY_GENERATED: 'AI_SUMMARY_GENERATED',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  FILE_UPLOADED: 'FILE_UPLOADED',
};

export const ACTIVITY_CONFIG = {
  [ACTIVITY_TYPES.PATIENT_REGISTERED]: {
    label: 'New Patient Registered',
    icon: 'UserPlus',
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  [ACTIVITY_TYPES.DOCTOR_APPROVED]: {
    label: 'Doctor Account Approved',
    icon: 'CheckCircle2',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  [ACTIVITY_TYPES.APPOINTMENT_CREATED]: {
    label: 'Appointment Scheduled',
    icon: 'Calendar',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  [ACTIVITY_TYPES.APPOINTMENT_CANCELLED]: {
    label: 'Appointment Cancelled',
    icon: 'XCircle',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
  [ACTIVITY_TYPES.PRESCRIPTION_ADDED]: {
    label: 'Prescription Issued',
    icon: 'Pill',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  [ACTIVITY_TYPES.DOCTOR_NOTE_CREATED]: {
    label: 'Doctor Note Authored',
    icon: 'FileText',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  [ACTIVITY_TYPES.AI_SUMMARY_GENERATED]: {
    label: 'AI Health Assessment Generated',
    icon: 'Sparkles',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  [ACTIVITY_TYPES.NOTIFICATION_SENT]: {
    label: 'System Notification Broadcasted',
    icon: 'Bell',
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  },
  [ACTIVITY_TYPES.FILE_UPLOADED]: {
    label: 'Clinical Document Uploaded',
    icon: 'Upload',
    color: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  },
};

export const QUICK_ACTIONS = [
  {
    id: 'approve-doctors',
    label: 'Approve Doctors',
    description: 'Review pending medical credentials',
    route: '/admin/doctors',
    icon: 'CheckSquare',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badge: 'Verification',
  },
  {
    id: 'manage-patients',
    label: 'Manage Patients',
    description: 'View patient records & history',
    route: '/patients',
    icon: 'Users',
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'view-reports',
    label: 'Platform Reports',
    description: 'View platform stats & analytics',
    route: '/admin/reports',
    icon: 'BarChart3',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'manage-notifications',
    label: 'Broadcast Alert',
    description: 'Send global notifications',
    route: '/notifications',
    icon: 'Bell',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'system-settings',
    label: 'System Settings',
    description: 'Configure platform settings & preferences',
    route: '/admin/settings',
    icon: 'Settings',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
];
