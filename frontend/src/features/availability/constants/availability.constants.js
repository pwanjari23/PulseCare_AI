// Days must be sent as strings to the backend (matches backend WEEK_DAYS constant)
export const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Weekday indices for filtering
export const WORKING_DAYS_DEFAULT = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Default slot duration (minutes)
export const DEFAULT_SLOT_DURATION = 30;

// Slot duration options shown in the UI
export const SLOT_DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min (default)' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
];

// Color theme per day for calendar / card accents
export const DAY_COLORS = {
  Sunday:    'from-rose-500/20   to-rose-500/5   border-rose-500/30   text-rose-500',
  Monday:    'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-500',
  Tuesday:   'from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-500',
  Wednesday: 'from-primary/20    to-primary/5    border-primary/30    text-primary',
  Thursday:  'from-amber-500/20  to-amber-500/5  border-amber-500/30  text-amber-500',
  Friday:    'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-500',
  Saturday:  'from-sky-500/20    to-sky-500/5    border-sky-500/30    text-sky-500',
};

export const DAY_ABBR = {
  Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
};

// Query cache stale time (ms)
export const AVAILABILITY_STALE_TIME = 1000 * 60 * 5;

// Time validation regex HH:mm or H:mm or HH:mm:ss
export const TIME_REGEX = /^([0-1]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

// Min/max working block duration (minutes) – mirrors backend constants
export const MIN_BLOCK_DURATION = 30;
export const MAX_BLOCK_DURATION = 720; // 12 hours
