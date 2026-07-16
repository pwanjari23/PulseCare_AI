const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Accepts HH:mm or HH:mm:ss
const TIME_FORMAT = /^([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

const MIN_SLOT_DURATION = 15;
const MAX_SLOT_DURATION = 720; // 12 hours

/**
 * Converts a weekday string (e.g. 'Monday') to its numeric index (0 = Sunday, 1 = Monday, etc.).
 * @param {string} day - Weekday name
 * @returns {number} Numeric index (0-6)
 */
const dayStringToNumeric = (day) => {
  if (!day) return -1;
  const normalized = day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase();
  return WEEK_DAYS.indexOf(normalized);
};

/**
 * Converts a numeric weekday index (0-6) to its string representation.
 * @param {number} num - Index
 * @returns {string} Weekday name
 */
const dayNumericToString = (num) => {
  if (num === undefined || num === null || num < 0 || num > 6) return null;
  return WEEK_DAYS[num];
};

/**
 * Calculates duration in minutes between start time and end time strings (HH:mm).
 * @param {string} start - Start time
 * @param {string} end - End time
 * @returns {number} Duration in minutes
 */
const calculateDurationMinutes = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

module.exports = {
  WEEK_DAYS,
  TIME_FORMAT,
  MIN_SLOT_DURATION,
  MAX_SLOT_DURATION,
  dayStringToNumeric,
  dayNumericToString,
  calculateDurationMinutes
};
