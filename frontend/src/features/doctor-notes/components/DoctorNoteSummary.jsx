import React from 'react';
import { ClipboardList, CheckCircle2, Calendar, Archive } from 'lucide-react';

export const DoctorNoteSummary = ({ notes = [] }) => {
  const total = notes.length;
  const active = notes.filter((n) => !n.isArchived).length;
  const archived = notes.filter((n) => n.isArchived).length;

  const stats = [
    {
      label: 'Total Consultations',
      value: total,
      sub: 'Clinical notes recorded',
      icon: ClipboardList,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Active Notes',
      value: active,
      sub: 'Active patient records',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Archived Notes',
      value: archived,
      sub: 'Historical records',
      icon: Archive,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Recent Encounters',
      value: `${total} Visits`,
      sub: 'Patient consultations',
      icon: Calendar,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
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

export default DoctorNoteSummary;
