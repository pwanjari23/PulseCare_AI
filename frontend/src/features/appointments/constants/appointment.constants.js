export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  RESCHEDULED: 'Rescheduled',
  NO_SHOW: 'No Show',
};

export const CONSULTATION_TYPES = [
  { id: 'In-Person', label: 'In-Person Clinic Visit' },
  { id: 'Video Consultation', label: 'Telehealth Video Call' },
];

export const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
];

export const APPOINTMENT_FILTERS = [
  { id: 'all', label: 'All Appointments' },
  { id: 'Upcoming', label: 'Upcoming' },
  { id: 'Today', label: 'Today' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Cancelled', label: 'Cancelled' },
];
