import React from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const DoctorAvailabilityPreview = () => {
  const slots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM'];

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-healing-500" />
          <h3 className="text-base font-bold text-foreground font-display">Upcoming Availability Preview</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Mon - Fri
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-semibold block">Available Slots Today:</span>
        <div className="flex flex-wrap gap-2">
          {slots.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-accent/40 border border-border/60 text-xs font-mono font-bold text-foreground flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{s}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityPreview;
