import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export const VitalStatusBadge = ({ status = 'Normal', alertGenerated = false }) => {
  const normalized = (status || (alertGenerated ? 'Warning' : 'Normal')).toLowerCase();

  const config = {
    normal: {
      label: 'Normal Vitals',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    warning: {
      label: 'Elevated Warning',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
    },
    critical: {
      label: 'Critical Alert',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: ShieldAlert,
    },
    hypertension: {
      label: 'Hypertension',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertCircle,
    },
    tachycardia: {
      label: 'Tachycardia',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
    },
    hypoxia: {
      label: 'Low Oxygen (Hypoxia)',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: ShieldAlert,
    },
  };

  const item = config[normalized] || (alertGenerated ? config.warning : config.normal);
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border font-mono uppercase tracking-wider ${item.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{item.label}</span>
    </span>
  );
};

export default VitalStatusBadge;
