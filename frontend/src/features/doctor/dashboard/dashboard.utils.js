/**
 * Returns dynamic doctor greeting based on local time of day
 */
export const getDoctorGreeting = (lastName = 'Doctor') => {
  const hour = new Date().getHours();
  let timeStr = 'Good Morning';
  if (hour >= 12 && hour < 18) timeStr = 'Good Afternoon';
  if (hour >= 18) timeStr = 'Good Evening';

  return `${timeStr}, Dr. ${lastName}`;
};

/**
 * Formats date string into readable text
 */
export const formatDoctorDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns badge styling based on alert severity
 */
export const getSeverityBadgeStyle = (severity = 'Warning') => {
  const level = String(severity).toLowerCase();
  if (level === 'critical' || level === 'high') {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  }
  if (level === 'warning' || level === 'medium') {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
};
