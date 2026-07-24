import React from 'react';
import { Stethoscope } from 'lucide-react';
import { getDoctorGreeting, formatDoctorDate } from './dashboard.utils';

export const DoctorDashboardHeader = ({ user, todayAppointmentsCount = 0, unreadCount = 0 }) => {
  const greeting = getDoctorGreeting(user?.lastName || 'Specialist');
  const formattedDate = formatDoctorDate();
  const specialization = user?.specialization || 'Clinical Specialist';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          <Stethoscope className="w-3.5 h-3.5 text-primary" />
          <span>{formattedDate} • {specialization}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight">
          {greeting} 👋
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You have <span className="font-bold text-primary">{todayAppointmentsCount} consultations</span> scheduled today.
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboardHeader;
