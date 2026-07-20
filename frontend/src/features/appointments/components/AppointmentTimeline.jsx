import React from 'react';
import { CheckCircle2, Clock, Calendar, XCircle, RefreshCw } from 'lucide-react';

const timelineSteps = [
  { status: 'Pending', label: 'Appointment Requested', icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { status: 'Confirmed', label: 'Appointment Confirmed', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { status: 'Completed', label: 'Consultation Completed', icon: Calendar, color: 'text-primary bg-primary/10 border-primary/20' },
];

const cancelledStep = { status: 'Cancelled', label: 'Appointment Cancelled', icon: XCircle, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
const rescheduledStep = { status: 'Rescheduled', label: 'Appointment Rescheduled', icon: RefreshCw, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };

export const AppointmentTimeline = ({ status = 'Confirmed' }) => {
  const isCancelled = status === 'Cancelled' || status === 'Rejected';
  const isRescheduled = status === 'Rescheduled';

  const steps = isCancelled
    ? [...timelineSteps.slice(0, 1), cancelledStep]
    : isRescheduled
    ? [...timelineSteps.slice(0, 2), rescheduledStep]
    : timelineSteps;

  const currentIndex = steps.findIndex((s) => s.status === status);
  const activeIndex = currentIndex >= 0 ? currentIndex : steps.length - 1;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-foreground font-display">Appointment Journey Timeline</h3>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.status} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                isActive ? step.color : 'bg-accent/30 border-border/40 text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="pt-1 space-y-0.5">
                <p className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded">
                    Current Status
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentTimeline;
