import { WEEK_DAYS, DEFAULT_SLOT_DURATION } from '../constants/availability.constants';

/**
 * Converts "09:00" → "9:00 AM" / "14:30" → "2:30 PM"
 */
export const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '—';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m} ${period}`;
};

/**
 * Calculates duration in minutes between two HH:mm strings.
 */
export const getDurationMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

/**
 * Formats minute duration → "3h 30m"
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Generates an array of time slot strings from a block.
 * e.g. generateTimeSlots("09:00", "12:00", 30) → ["09:00", "09:30", "10:00", ...]
 */
export const generateTimeSlots = (startTime, endTime, slotDuration = DEFAULT_SLOT_DURATION) => {
  if (!startTime || !endTime) return [];
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let current = sh * 60 + sm;
  const end = eh * 60 + em;

  while (current + slotDuration <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    current += slotDuration;
  }
  return slots;
};

/**
 * Groups slots into Morning (before 12), Afternoon (12-17), Evening (17+)
 */
export const groupSlotsByPeriod = (slots) => {
  const morning = [], afternoon = [], evening = [];
  slots.forEach((slot) => {
    const h = parseInt(slot.split(':')[0], 10);
    if (h < 12) morning.push(slot);
    else if (h < 17) afternoon.push(slot);
    else evening.push(slot);
  });
  return { morning, afternoon, evening };
};

/**
 * Counts enabled working days from schedule array.
 */
export const getWorkingDaysCount = (schedule = []) =>
  schedule.filter((s) => s.isAvailable !== false).length;

/**
 * Sums total weekly working hours from schedule.
 */
export const getTotalWeeklyHours = (schedule = []) => {
  const totalMinutes = schedule
    .filter((s) => s.isAvailable !== false)
    .reduce((sum, s) => sum + getDurationMinutes(s.startTime, s.endTime), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
};

/**
 * Returns the next date (from today) that falls on one of the scheduled working days.
 */
export const getNextWorkingDay = (schedule = []) => {
  const enabledDays = schedule
    .filter((s) => s.isAvailable !== false)
    .map((s) => WEEK_DAYS.indexOf(s.dayOfWeek));

  if (enabledDays.length === 0) return null;

  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (enabledDays.includes(d.getDay())) {
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  }
  return null;
};

/**
 * Returns the schedule entry for today's day of week, or null if not working today.
 */
export const getTodaySchedule = (schedule = []) => {
  const todayName = WEEK_DAYS[new Date().getDay()];
  return schedule.find((s) => s.dayOfWeek === todayName && s.isAvailable !== false) || null;
};

/**
 * Checks if a date (Date object) is a working day in the schedule.
 */
export const isAvailableOnDate = (schedule = [], date) => {
  const dayName = WEEK_DAYS[date.getDay()];
  return schedule.some((s) => s.dayOfWeek === dayName && s.isAvailable !== false);
};
