/**
 * Returns badge styling for appointment status
 */
export const getAppointmentStatusStyle = (status = 'Confirmed') => {
  const s = String(status).toLowerCase();
  if (s === 'confirmed') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (s === 'completed') return 'bg-primary/10 text-primary border-primary/20';
  if (s === 'cancelled' || s === 'rejected') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  if (s === 'pending') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  if (s === 'rescheduled') return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
};

/**
 * Formats appointment date string
 */
export const formatAppointmentDate = (dateStr) => {
  if (!dateStr) return 'Today';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};
