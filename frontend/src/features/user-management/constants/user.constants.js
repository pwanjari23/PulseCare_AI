/**
 * PulseCare AI - User Management Constants
 */

export const USER_ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
};

export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    label: 'Administrator',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    icon: 'ShieldCheck',
  },
  [USER_ROLES.DOCTOR]: {
    label: 'Doctor',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'Stethoscope',
  },
  [USER_ROLES.PATIENT]: {
    label: 'Patient',
    badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    icon: 'User',
  },
};

export const USER_STATUSES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
  APPROVED: 'Approved',
  SUSPENDED: 'Suspended',
};

export const STATUS_CONFIG = {
  [USER_STATUSES.ACTIVE]: {
    label: 'Active',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'CheckCircle2',
  },
  [USER_STATUSES.INACTIVE]: {
    label: 'Inactive',
    badgeClass: 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20',
    icon: 'Clock',
  },
  [USER_STATUSES.PENDING]: {
    label: 'Pending Approval',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: 'AlertTriangle',
  },
  [USER_STATUSES.REJECTED]: {
    label: 'Rejected',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    icon: 'XCircle',
  },
  [USER_STATUSES.APPROVED]: {
    label: 'Approved',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'CheckCircle2',
  },
  [USER_STATUSES.SUSPENDED]: {
    label: 'Suspended',
    badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    icon: 'ShieldAlert',
  },
};

export const VERIFICATION_STATUSES = {
  VERIFIED: 'Verified',
  UNVERIFIED: 'Unverified',
  PENDING: 'Pending Review',
};

export const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'General Practice',
  'Dermatology',
  'Orthopedics',
  'Psychiatry',
  'Radiology',
  'Oncology',
  'Endocrinology',
];
