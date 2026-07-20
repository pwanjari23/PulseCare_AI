import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const AvailabilityCard = ({ availability }) => {
  const info = availability || {
    workingDays: 'Mon - Fri',
    schedule: '09:00 AM - 05:00 PM',
    nextSlot: '11:30 AM Today',
    status: 'Available',
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-healing-500" />
          <h3 className="text-base font-bold text-foreground font-display">Schedule & Availability</h3>
        </div>
        <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{info.status}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Working Days</span>
          </span>
          <p className="font-bold text-foreground">{info.workingDays}</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Clock className="w-3 h-3 text-healing-500" />
            <span>Next Open Slot</span>
          </span>
          <p className="font-bold text-foreground">{info.nextSlot}</p>
        </div>
      </div>

      <Link
        to="/doctor/availability"
        className="w-full py-2 px-3 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-xl text-center transition-colors block"
      >
        Manage Clinical Schedule
      </Link>
    </div>
  );
};

export default AvailabilityCard;
