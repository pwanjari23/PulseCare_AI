import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, ChevronRight, XCircle, CheckCircle2 } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';

export const AppointmentCard = ({ appointment, role = 'patient', onCancel, onComplete }) => {
  const isDoctor = role === 'doctor';

  const doctorName = appointment.Doctor
    ? `Dr. ${appointment.Doctor.firstName || ''} ${appointment.Doctor.lastName || ''}`
    : appointment.doctorName || 'Dr. Specialist';

  const patientName = appointment.Patient
    ? `${appointment.Patient.firstName || ''} ${appointment.Patient.lastName || ''}`
    : appointment.patientName || 'Patient User';

  const scheduledDate = appointment.scheduledAt
    ? new Date(appointment.scheduledAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : appointment.date || 'TBD';

  const scheduledTime = appointment.scheduledAt
    ? new Date(appointment.scheduledAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : appointment.time || '10:00 AM';

  const isCompleted = appointment.status?.toLowerCase() === 'completed';
  const isCancelled = appointment.status?.toLowerCase() === 'cancelled';

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header: Name & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
              {isDoctor ? <User className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">
                {isDoctor ? patientName : doctorName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {isDoctor ? 'Patient Appointment' : appointment.specialization || 'General Consultation'}
              </p>
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-accent/40 p-2.5 rounded-xl border border-border/40">
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-foreground truncate">{scheduledDate}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-healing-500" />
            <span className="font-medium text-foreground truncate">{scheduledTime}</span>
          </div>
        </div>

        {/* Reason */}
        {appointment.reason && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            <span className="font-semibold text-foreground">Reason: </span>
            {appointment.reason}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <Link
          to={`/appointments/${appointment.id}`}
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center space-x-2">
          {isDoctor && !isCompleted && !isCancelled && onComplete && (
            <button
              onClick={() => onComplete(appointment)}
              className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold rounded-lg border border-emerald-500/20 transition-colors flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
          )}

          {!isCompleted && !isCancelled && onCancel && (
            <button
              onClick={() => onCancel(appointment)}
              className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-lg border border-rose-500/20 transition-colors flex items-center space-x-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
