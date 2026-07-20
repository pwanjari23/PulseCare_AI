export const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Psychiatry',
  'Oncology',
  'Gynecology',
  'Ophthalmology',
];

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const DOCTOR_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
};

export const DOCTOR_FILTERS = [
  { id: 'all', label: 'All Doctors' },
  { id: 'Verified', label: 'Verified Only' },
  { id: 'Cardiology', label: 'Cardiology' },
  { id: 'Neurology', label: 'Neurology' },
  { id: 'General Medicine', label: 'General Practice' },
];
