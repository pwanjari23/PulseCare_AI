import React from 'react';
import { CheckCircle2, Clock, CalendarCheck, XCircle } from 'lucide-react';

export const AppointmentTimeline = ({ status = 'Scheduled', createdAt, updatedAt }) => {
  const currentStatus = status.toLowerCase();

  const isCancelled = currentStatus === 'cancelled';
  const isCompleted = currentStatus === 'completed';
  const isConfirmed = currentStatus === 'confirmed' || isCompleted;

  const steps = [
    {
      id: 'booked',
      title: 'Appointment Booked',
      desc: 'Booking submitted successfully',
      date: createdAt ? new Date(createdAt).toLocaleString() : 'System Log',
      completed: true,
      icon: CalendarCheck,
    },
    {
      id: 'confirmed',
      title: 'Confirmed by Doctor',
      desc: isConfirmed ? 'Consultation slot confirmed' : 'Awaiting doctor confirmation',
      date: isConfirmed && updatedAt ? new Date(updatedAt).toLocaleString() : 'Pending',
      completed: isConfirmed,
      icon: Clock,
    },
    {
      id: 'completed',
      title: isCancelled ? 'Appointment Cancelled' : 'Consultation Completed',
      desc: isCancelled ? 'Booking was cancelled' : isCompleted ? 'Clinical notes & vitals saved' : 'Pending completion',
      date: (isCompleted || isCancelled) && updatedAt ? new Date(updatedAt).toLocaleString() : 'Scheduled',
      completed: isCompleted || isCancelled,
      icon: isCancelled ? XCircle : CheckCircle2,
      isCancelled,
    },
  ];

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider">
        Appointment Timeline
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {steps.map((step) => {
          const Icon = step.icon;
          const iconColor = step.isCancelled
            ? 'bg-rose-500 text-white'
            : step.completed
            ? 'bg-emerald-500 text-white'
            : 'bg-accent text-muted-foreground border border-border/60';

          return (
            <div key={step.id} className="relative flex items-start space-x-3 text-xs">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs ${iconColor}`}
              >
                <Icon className="w-3 h-3" />
              </div>
              <div>
                <h5 className="font-bold text-foreground">{step.title}</h5>
                <p className="text-muted-foreground text-[11px] mt-0.5">{step.desc}</p>
                <span className="text-[10px] font-mono text-muted-foreground/80 block mt-1">
                  {step.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentTimeline;
