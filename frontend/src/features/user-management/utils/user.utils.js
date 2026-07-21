/**
 * PulseCare AI - User Management Utility Helpers
 */

import { USER_ROLES, USER_STATUSES } from '../constants/user.constants';

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const formatLastLogin = (dateStr) => {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recently';
  const diffSecs = Math.floor((new Date() - d) / 1000);
  if (diffSecs < 3600) return 'Just now';
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return formatDate(dateStr);
};

/**
 * Filter users array by search term and filter criteria
 */
export const filterUsers = (users = [], searchTerm = '', filters = {}) => {
  return users.filter((u) => {
    // Role filter
    if (filters.role && filters.role !== 'ALL' && u.role !== filters.role) {
      return false;
    }
    // Status filter
    if (filters.status && filters.status !== 'ALL' && u.status !== filters.status) {
      return false;
    }
    // Specialization filter for doctors
    if (filters.specialization && filters.specialization !== 'ALL') {
      const spec = u.doctorProfile?.specialization || u.specialization;
      if (spec !== filters.specialization) return false;
    }

    // Search query filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const license = (u.doctorProfile?.licenseNumber || '').toLowerCase();
      const mrn = (u.patientProfile?.mrn || '').toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        license.includes(term) ||
        mrn.includes(term)
      );
    }

    return true;
  });
};

/**
 * Sort users array
 */
export const sortUsers = (users = [], sortKey = 'name', sortOrder = 'asc') => {
  return [...users].sort((a, b) => {
    let valA = '';
    let valB = '';

    if (sortKey === 'name') {
      valA = `${a.firstName} ${a.lastName}`.toLowerCase();
      valB = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else if (sortKey === 'createdAt') {
      valA = new Date(a.createdAt || 0).getTime();
      valB = new Date(b.createdAt || 0).getTime();
    } else if (sortKey === 'role') {
      valA = a.role || '';
      valB = b.role || '';
    } else if (sortKey === 'status') {
      valA = a.status || '';
      valB = b.status || '';
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Baseline mock data generator for User Management demonstration
 */
export const getBaselineUsers = () => [
  {
    id: 1,
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@pulsecare.ai',
    phone: '+1 (555) 234-5678',
    role: USER_ROLES.DOCTOR,
    status: USER_STATUSES.ACTIVE,
    isVerified: true,
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-07-21T10:00:00Z',
    doctorProfile: {
      licenseNumber: 'MD-98421',
      specialization: 'Cardiology',
      experienceYears: 12,
      qualification: 'MD, FACC',
      hospital: 'Metro Health Cardiology',
    },
    stats: { appointments: 42, prescriptions: 28, doctorNotes: 35 },
  },
  {
    id: 2,
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@pulsecare.ai',
    phone: '+1 (555) 345-6789',
    role: USER_ROLES.DOCTOR,
    status: USER_STATUSES.PENDING,
    isVerified: false,
    createdAt: '2026-07-20T14:30:00Z',
    lastLogin: '2026-07-20T14:30:00Z',
    doctorProfile: {
      licenseNumber: 'MD-74102',
      specialization: 'Neurology',
      experienceYears: 8,
      qualification: 'MD, PhD',
      hospital: 'Neuro Science Institute',
    },
    stats: { appointments: 0, prescriptions: 0, doctorNotes: 0 },
  },
  {
    id: 3,
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 (555) 876-5432',
    role: USER_ROLES.PATIENT,
    status: USER_STATUSES.ACTIVE,
    isVerified: true,
    createdAt: '2026-03-10T11:20:00Z',
    lastLogin: '2026-07-21T08:15:00Z',
    patientProfile: {
      mrn: 'MRN-88492',
      gender: 'Female',
      dateOfBirth: '1988-05-14',
      assignedDoctor: 'Dr. Robert Chen',
    },
    stats: { appointments: 8, prescriptions: 3, doctorNotes: 4, aiSummaries: 2 },
  },
  {
    id: 4,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 654-3210',
    role: USER_ROLES.PATIENT,
    status: USER_STATUSES.ACTIVE,
    isVerified: true,
    createdAt: '2026-04-02T16:45:00Z',
    lastLogin: '2026-07-19T12:00:00Z',
    patientProfile: {
      mrn: 'MRN-91204',
      gender: 'Male',
      dateOfBirth: '1992-11-20',
      assignedDoctor: 'Dr. Robert Chen',
    },
    stats: { appointments: 5, prescriptions: 2, doctorNotes: 3, aiSummaries: 1 },
  },
  {
    id: 5,
    firstName: 'Pratiksha',
    lastName: 'Wanjari',
    email: 'admin@pulsecare.ai',
    phone: '+1 (555) 999-0000',
    role: USER_ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE,
    isVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: '2026-07-21T14:00:00Z',
    adminProfile: {
      permissions: ['ALL'],
      createdBy: 'System Root',
    },
    stats: { totalActions: 1420 },
  },
];
