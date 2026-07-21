/**
 * PulseCare AI - Notification Constants
 */

export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'Appointment',
  VITAL_ALERT: 'VitalAlert',
  DOCTOR_APPROVAL: 'DoctorApproval',
  PRESCRIPTION: 'Prescription',
  REMINDER: 'Reminder',
  SYSTEM: 'System',
};

export const NOTIFICATION_TYPE_CONFIG = {
  Appointment: {
    label: 'Appointment',
    iconName: 'Calendar',
    colorClass: 'text-primary bg-primary/10 border-primary/20',
    hex: '#0284c7',
  },
  VitalAlert: {
    label: 'Vital Alert',
    iconName: 'AlertTriangle',
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    hex: '#f43f5e',
  },
  DoctorApproval: {
    label: 'Doctor Verification',
    iconName: 'Stethoscope',
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    hex: '#9333ea',
  },
  Prescription: {
    label: 'Prescription',
    iconName: 'Pill',
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    hex: '#059669',
  },
  Reminder: {
    label: 'Reminder',
    iconName: 'Clock',
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    hex: '#d97706',
  },
  System: {
    label: 'System Notice',
    iconName: 'Bell',
    colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    hex: '#0284c7',
  },
};

export const NOTIFICATION_FILTER_OPTIONS = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread Only' },
  { value: 'read', label: 'Read Only' },
  { value: 'Appointment', label: 'Appointments' },
  { value: 'VitalAlert', label: 'Vital Alerts' },
  { value: 'Prescription', label: 'Prescriptions' },
  { value: 'System', label: 'System Announcements' },
];

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
];
