import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const AppointmentStatusBadge = ({ status = 'Scheduled' }) => {
  const normalized = status?.toLowerCase() || 'scheduled';

  const config = {
    scheduled: {
      label: 'Scheduled',
      bg: 'bg-primary/10 text-primary border-primary/20',
      icon: Calendar,
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-healing-500/10 text-healing-600 dark:text-healing-400 border-healing-500/20',
      icon: Clock,
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: XCircle,
    },
    pending: {
      label: 'Pending',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertCircle,
    },
  };

  const item = config[normalized] || config.scheduled;
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border font-mono uppercase tracking-wider ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{item.label}</span>
    </span>
  );
};

export default AppointmentStatusBadge;
