/**
 * Returns dynamic admin greeting based on local time of day
 */
export const getAdminGreeting = (firstName = 'Administrator') => {
  const hour = new Date().getHours();
  let timeStr = 'Good Morning';
  if (hour >= 12 && hour < 18) timeStr = 'Good Afternoon';
  if (hour >= 18) timeStr = 'Good Evening';

  return `${timeStr}, ${firstName}`;
};

/**
 * Formats date into readable text
 */
export const formatAdminDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns health badge style for system components
 */
export const getSystemHealthStyle = (status = 'UP') => {
  const s = String(status).toUpperCase();
  if (s === 'UP' || s === 'HEALTHY' || s === 'ONLINE') {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  }
  if (s === 'DEGRADED' || s === 'WARNING') {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
};
