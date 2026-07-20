import React from 'react';
import { Stethoscope, Calendar, Clock, MessageSquare, DollarSign, Video } from 'lucide-react';
import { formatAppointmentDate } from '../utils/appointment.utils';

export const AppointmentSummary = ({ formData, selectedDoctor }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-foreground font-display">Booking Summary</h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary/5 border border-primary/20">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span>Selected Doctor</span>
          </span>
          <span className="font-bold text-foreground">
            Dr. {selectedDoctor?.firstName || ''} {selectedDoctor?.lastName || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-accent/30 border border-border/40">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-healing-500" />
            <span>Appointment Date</span>
          </span>
          <span className="font-bold text-foreground">{formatAppointmentDate(formData?.date)}</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-accent/30 border border-border/40">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Time Slot</span>
          </span>
          <span className="font-bold text-foreground font-mono">{formData?.slotTime || '—'}</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-accent/30 border border-border/40">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Video className="w-4 h-4 text-indigo-500" />
            <span>Visit Type</span>
          </span>
          <span className="font-bold text-foreground">{formData?.type || 'In-Person'}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-muted-foreground flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span>Reason for Visit</span>
          </span>
          <p className="font-semibold text-foreground leading-relaxed pt-1">
            {formData?.reason || '—'}
          </p>
        </div>

        {selectedDoctor?.consultationFee && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-muted-foreground flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Consultation Fee</span>
            </span>
            <span className="font-extrabold text-foreground font-display text-sm">
              ${selectedDoctor.consultationFee}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSummary;
