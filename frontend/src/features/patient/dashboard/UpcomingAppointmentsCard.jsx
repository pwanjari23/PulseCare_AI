import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, ChevronRight, Plus } from 'lucide-react';

export const UpcomingAppointmentsCard = ({ appointments = [] }) => {
  const upcomingList = appointments.filter((a) => a.status?.toLowerCase() !== 'cancelled');

  if (upcomingList.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">No Upcoming Appointments</h3>
          <p className="text-xs text-muted-foreground">You have no scheduled consultations at this moment.</p>
        </div>
        <Link
          to="/appointments/book"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>
    );
  }

  const nextApp = upcomingList[0];
  const doctorName = nextApp.Doctor
    ? `Dr. ${nextApp.Doctor.firstName || ''} ${nextApp.Doctor.lastName || ''}`
    : nextApp.doctorName || 'Dr. Specialist';

  const scheduledDate = nextApp.scheduledAt
    ? new Date(nextApp.scheduledAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'Upcoming';

  const scheduledTime = nextApp.scheduledAt
    ? new Date(nextApp.scheduledAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '10:00 AM';

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Upcoming Consultation</h3>
        </div>
        <Link
          to="/appointments"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All ({upcomingList.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{doctorName}</h4>
              <p className="text-xs text-muted-foreground">{nextApp.specialization || 'Cardiology Consultation'}</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-healing-500/10 text-healing-600 dark:text-healing-400 border border-healing-500/20">
            {nextApp.status || 'Scheduled'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-card p-2.5 rounded-xl border border-border/40">
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">{scheduledDate}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-healing-500" />
            <span className="font-semibold text-foreground">{scheduledTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointmentsCard;
