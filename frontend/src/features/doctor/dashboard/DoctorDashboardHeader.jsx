import React from 'react';
import { Bell, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
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

      <div className="flex items-center space-x-3 z-10 self-start sm:self-center">
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-2xl bg-accent/60 hover:bg-accent border border-border/60 text-foreground transition-all duration-200"
          title="View Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center border-2 border-card">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-accent/30 border border-border/50">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
            Dr
          </div>
          <div className="text-left hidden md:block">
            <span className="text-xs font-bold text-foreground block">Dr. {user?.firstName} {user?.lastName}</span>
            <span className="text-[10px] text-muted-foreground font-mono">MD Practitioner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardHeader;
