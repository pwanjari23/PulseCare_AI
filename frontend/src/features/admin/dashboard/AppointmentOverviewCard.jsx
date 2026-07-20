import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export const AppointmentOverviewCard = ({ breakdown }) => {
  const data = breakdown || {
    completed: 12,
    cancelled: 1,
    pending: 3,
    scheduledToday: 16,
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-foreground font-display">Appointments Telemetry Overview</h3>
        </div>
        <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
          {data.scheduledToday} Total Today
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed</span>
          </span>
          <p className="text-xl font-extrabold text-foreground font-display">{data.completed}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending</span>
          </span>
          <p className="text-xl font-extrabold text-foreground font-display">{data.pending}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelled</span>
          </span>
          <p className="text-xl font-extrabold text-foreground font-display">{data.cancelled}</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentOverviewCard;
