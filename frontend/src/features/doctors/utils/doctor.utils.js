/**
 * Formats consultation fee in currency
 */
export const formatConsultationFee = (fee = 100) => {
  return `$${Number(fee).toFixed(0)}`;
};

/**
 * Returns badge styling based on doctor verification status
 */
export const getVerificationBadgeStyle = (status = 'Verified') => {
  const s = String(status).toLowerCase();
  if (s === 'verified') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (s === 'rejected') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
};

/**
 * Returns badge styling for doctor account status
 */
export const getDoctorStatusStyle = (status = 'Active') => {
  const s = String(status).toLowerCase();
  if (s === 'active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (s === 'suspended') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
};
