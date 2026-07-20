/**
 * Returns dynamic greeting based on local time of day
 */
export const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Formats date into readable string (e.g. "Monday, July 20, 2026")
 */
export const formatDashboardDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns risk badge styling based on risk level
 */
export const getRiskBadgeStyle = (riskLevel = 'Low') => {
  const level = String(riskLevel).toLowerCase();
  if (level === 'high' || level === 'critical') {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  }
  if (level === 'medium' || level === 'moderate') {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
};
