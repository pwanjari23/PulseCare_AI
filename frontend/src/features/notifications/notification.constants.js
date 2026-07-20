import { Calendar, ShieldAlert, UserCheck, FileText, Clock, Bell, Info } from 'lucide-react';

export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'Appointment',
  VITAL_ALERT: 'VitalAlert',
  DOCTOR_APPROVAL: 'DoctorApproval',
  PRESCRIPTION: 'Prescription',
  REMINDER: 'Reminder',
  SYSTEM: 'System',
};

export const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.APPOINTMENT]: {
    label: 'Appointment',
    icon: Calendar,
    color: 'primary',
    bg: 'bg-primary/10 text-primary border-primary/20',
  },
  [NOTIFICATION_TYPES.VITAL_ALERT]: {
    label: 'Vital Alert',
    icon: ShieldAlert,
    color: 'rose',
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  [NOTIFICATION_TYPES.DOCTOR_APPROVAL]: {
    label: 'Doctor Approval',
    icon: UserCheck,
    color: 'emerald',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  [NOTIFICATION_TYPES.PRESCRIPTION]: {
    label: 'Prescription',
    icon: FileText,
    color: 'amber',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    label: 'Reminder',
    icon: Clock,
    color: 'indigo',
    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    label: 'System Notice',
    icon: Bell,
    color: 'slate',
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  },
};

export const NOTIFICATION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
  { id: NOTIFICATION_TYPES.APPOINTMENT, label: 'Appointments' },
  { id: NOTIFICATION_TYPES.VITAL_ALERT, label: 'Vital Alerts' },
  { id: NOTIFICATION_TYPES.PRESCRIPTION, label: 'Prescriptions' },
  { id: NOTIFICATION_TYPES.REMINDER, label: 'Reminders' },
  { id: NOTIFICATION_TYPES.DOCTOR_APPROVAL, label: 'Approvals' },
  { id: NOTIFICATION_TYPES.SYSTEM, label: 'System' },
];
