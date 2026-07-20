import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  CheckCircle2,
  XCircle,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useAppointment } from '../../hooks/useAppointments';
import {
  AppointmentStatusBadge,
  AppointmentTimeline,
  CancelAppointmentDialog,
  CompleteAppointmentDialog,
} from '../../components/appointments';

export const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';
  const isDoctor = role === 'doctor';

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const { data, isLoading } = useAppointment(id);

  // Mock detail fallback for development preview if API is loading or empty
  const appointment = data || {
    id: id || 101,
    Doctor: { firstName: 'Sarah', lastName: 'Jenkins', email: 's.jenkins@hospital.org', specialization: 'Cardiology' },
    Patient: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1 (555) 012-3456' },
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'Confirmed',
    reason: 'Routine cardiology follow-up and blood pressure check',
    durationMinutes: 30,
    notes: 'Patient reported minor dizziness during morning exercises. Prescribed blood pressure monitor logging.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  };

  const doctorName = appointment.Doctor
    ? `Dr. ${appointment.Doctor.firstName || ''} ${appointment.Doctor.lastName || ''}`
    : 'Dr. Specialist';

  const patientName = appointment.Patient
    ? `${appointment.Patient.firstName || ''} ${appointment.Patient.lastName || ''}`
    : 'Patient User';

  const scheduledDate = appointment.scheduledAt
    ? new Date(appointment.scheduledAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  const scheduledTime = appointment.scheduledAt
    ? new Date(appointment.scheduledAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '10:00 AM';

  const isCompleted = appointment.status?.toLowerCase() === 'completed';
  const isCancelled = appointment.status?.toLowerCase() === 'cancelled';

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-muted-foreground">Loading appointment details...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/appointments')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Appointments</span>
        </button>

        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-border/50 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                  APPOINTMENT #{appointment.id}
                </span>
                <h2 className="text-xl font-bold text-foreground font-display">
                  {isDoctor ? patientName : doctorName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isDoctor ? 'Patient Consultation' : appointment.Doctor?.specialization || 'General Practice'}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                {isDoctor ? <User className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
              </div>
            </div>

            {/* Time & Slot Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-accent/30 p-4 rounded-2xl border border-border/40 text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-card border border-border/50 text-primary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Date</span>
                  <span className="font-bold text-foreground">{scheduledDate}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-card border border-border/50 text-healing-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Time & Duration</span>
                  <span className="font-bold text-foreground">{scheduledTime} ({appointment.durationMinutes || 30} mins)</span>
                </div>
              </div>
            </div>

            {/* Consultation Type Banner */}
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2 text-primary">
                <Video className="w-4 h-4" />
                <span className="font-semibold">PulseCare Telehealth Video Room</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-primary/15 px-2 py-0.5 rounded text-primary font-bold">
                Encrypted SSL
              </span>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground">Reason for Visit</h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-accent/20 p-3 rounded-xl border border-border/40">
                {appointment.reason || 'General consultation request.'}
              </p>
            </div>

            {/* Clinical Notes (if available) */}
            {appointment.notes && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Doctor Clinical Notes</span>
                </h4>
                <p className="text-xs text-foreground leading-relaxed bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl font-medium">
                  {appointment.notes}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-end space-x-3">
              {isDoctor && !isCompleted && !isCancelled && (
                <button
                  onClick={() => setIsCompleteOpen(true)}
                  className="px-4 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
              )}

              {!isCompleted && !isCancelled && (
                <button
                  onClick={() => setIsCancelOpen(true)}
                  className="px-4 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-xl border border-rose-500/20 transition-colors flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Appointment</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Timeline & User Details */}
        <div className="space-y-6">
          <AppointmentTimeline
            status={appointment.status}
            createdAt={appointment.createdAt}
            updatedAt={appointment.updatedAt}
          />

          {/* Contact Details Card */}
          <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-foreground flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>{isDoctor ? 'Patient Contact Info' : 'Doctor Contact Info'}</span>
            </h4>
            <div className="space-y-1.5 text-muted-foreground">
              <p><span className="font-semibold text-foreground">Name: </span>{isDoctor ? patientName : doctorName}</p>
              <p><span className="font-semibold text-foreground">Email: </span>{isDoctor ? appointment.Patient?.email : appointment.Doctor?.email}</p>
              {isDoctor && appointment.Patient?.phone && (
                <p><span className="font-semibold text-foreground">Phone: </span>{appointment.Patient.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <CancelAppointmentDialog
        appointment={appointment}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
      />

      {/* Complete Dialog */}
      <CompleteAppointmentDialog
        appointment={appointment}
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
      />
    </div>
  );
};

export default AppointmentDetails;
