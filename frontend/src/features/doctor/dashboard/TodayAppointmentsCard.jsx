import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User, ChevronRight } from 'lucide-react';

export const TodayAppointmentsCard = ({ appointments = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Today's Appointments</h3>
        </div>
        <Link
          to="/doctor/appointments"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">No appointments scheduled for today.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((app) => {
            const patientName = app.Patient
              ? `${app.Patient.firstName || ''} ${app.Patient.lastName || ''}`
              : app.patientName || 'Patient User';

            const timeStr = app.scheduledAt
              ? new Date(app.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : '10:00 AM';

            return (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-accent/30 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{patientName}</h4>
                    <p className="text-muted-foreground text-[11px] truncate max-w-xs">{app.reason || 'Routine Consultation'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 justify-between sm:justify-end">
                  <span className="flex items-center space-x-1 text-muted-foreground font-semibold">
                    <Clock className="w-3.5 h-3.5 text-healing-500" />
                    <span>{timeStr}</span>
                  </span>

                  <button
                    onClick={() => navigate(`/appointments/${app.id}`)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Start Room</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayAppointmentsCard;
