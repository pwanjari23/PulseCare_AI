import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const PrescriptionSummary = ({ prescriptions = [] }) => {
  const total = prescriptions.length;
  const active = prescriptions.filter((p) => (p.status || 'Active') === 'Active').length;
  const completed = prescriptions.filter((p) => p.status === 'Completed').length;
  const expired = prescriptions.filter((p) => p.status === 'Expired' || p.status === 'Discontinued').length;

  const stats = [
    {
      label: 'Total Prescriptions',
      value: total,
      sub: 'Issued records',
      icon: FileText,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Active Medications',
      value: active,
      sub: 'Currently in effect',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Completed Courses',
      value: completed,
      sub: 'Finished treatment',
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Expired / Stopped',
      value: expired,
      sub: 'Discontinued or expired',
      icon: AlertCircle,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {stats.map(({ label, value, sub, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm space-y-2 hover:border-border transition-colors"
        >
          <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider">{label}</p>
            <p className="text-xl font-extrabold text-foreground font-display leading-tight truncate">{value}</p>
            <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionSummary;
