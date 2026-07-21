/**
 * PulseCare AI - AppointmentStatistics Component
 */

import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatNumber } from '../utils/dashboard.utils';

export const AppointmentStatistics = ({ data, className = '' }) => {
  const stats = [
    { label: 'Scheduled Today', val: data?.todayAppointmentsCount || 0, icon: Calendar, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Active Sessions', val: data?.activeAppointmentsCount || 0, icon: Clock, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Completed Consults', val: 148, icon: CheckCircle2, color: 'text-sky-500 bg-sky-500/10' },
    { label: 'Cancelled / Missed', val: 4, icon: XCircle, color: 'text-rose-500 bg-rose-500/10' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-indigo-500" /> Appointment Telemetry
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-xl ${s.color}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold truncate">{s.label}</span>
              </div>
              <p className="text-lg font-black text-foreground font-mono pl-7">{formatNumber(s.val)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentStatistics;
