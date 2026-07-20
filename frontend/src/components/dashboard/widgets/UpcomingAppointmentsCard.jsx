import React from 'react';
import { Calendar, Clock, Video, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpcomingAppointmentsCard = ({ appointments, role = 'patient' }) => {
  const defaultAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      patientName: 'John Doe',
      time: 'Tomorrow, 10:00 AM',
      type: 'Telehealth Video',
      icon: Video,
      status: 'Confirmed',
    },
    {
      id: 2,
      doctorName: 'Dr. Marcus Vance',
      specialty: 'Neurologist',
      patientName: 'Emma Watson',
      time: 'July 24, 02:30 PM',
      type: 'In-Person Clinic',
      icon: MapPin,
      status: 'Pending',
    },
  ];

  const items = appointments || defaultAppointments;
  const isDoctor = role === 'doctor';

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Upcoming Consultations</h3>
        </div>
        <Link
          to={isDoctor ? '/doctor/appointments' : '/patient/appointments'}
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((app) => {
          const TypeIcon = app.icon || Video;
          return (
            <div
              key={app.id}
              className="p-3.5 rounded-xl border border-border/50 bg-accent/20 hover:bg-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-foreground">
                    {isDoctor ? app.patientName : app.doctorName}
                  </span>
                  {!isDoctor && <span className="text-[11px] text-muted-foreground">• {app.specialty}</span>}
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{app.time}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <TypeIcon className="w-3 h-3 text-healing-500" />
                    <span>{app.type}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    app.status === 'Confirmed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingAppointmentsCard;
