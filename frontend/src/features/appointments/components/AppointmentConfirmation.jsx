import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { formatAppointmentDate } from '../utils/appointment.utils';

export const AppointmentConfirmation = ({ appointment }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm text-center space-y-6 max-w-md mx-auto">
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-foreground font-display">Appointment Booked!</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your appointment has been successfully scheduled. You will receive a confirmation notification shortly.
        </p>
      </div>

      {appointment && (
        <div className="text-left space-y-2 text-xs bg-accent/30 border border-border/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Doctor</span>
            <span className="font-bold text-foreground">{appointment.doctorName || 'Dr. Sarah Jenkins'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-bold text-foreground">{formatAppointmentDate(appointment.date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-mono font-bold text-foreground">{appointment.slotTime || '10:30 AM'}</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 justify-center">
        <button
          onClick={() => navigate('/patient/appointments')}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>My Appointments</span>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2.5 bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent/80 flex items-center space-x-1.5"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
