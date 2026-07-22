import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Stethoscope, MapPin, DollarSign, FileText, X, Video } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useAppointment } from '../hooks/useAppointment';
import { useUpdateAppointment } from '../hooks/useUpdateAppointment';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import AppointmentStatusBadge from '../components/AppointmentStatusBadge';
import AppointmentTimeline from '../components/AppointmentTimeline';
import CancelAppointmentDialog from '../components/CancelAppointmentDialog';
import { formatAppointmentDate } from '../utils/appointment.utils';
import { WidgetSkeleton, DashboardErrorState } from '../../../components/dashboard';

export const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isDoctor = role === 'doctor';

  const [showCancel, setShowCancel] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const { data: appt, isLoading, isError, error, refetch } = useAppointment(id);
  const completeMutation = useUpdateAppointment(id);
  const cancelMutation = useCancelAppointment();

  if (isLoading) return <WidgetSkeleton height="h-96" />;
  if (isError || !appt) {
    return (
      <DashboardErrorState
        title="Appointment Not Found"
        message={error?.message || 'Could not retrieve appointment details.'}
        onRetry={() => refetch()}
      />
    );
  }

  const canCancel = ['Pending', 'Confirmed'].includes(appt.status);
  const canComplete = isDoctor && appt.status === 'Confirmed';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Appointments</span>
      </button>

      {/* Header card */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 z-10 relative">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-foreground font-display">Appointment #{appt.id}</h1>
              <AppointmentStatusBadge status={appt.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {appt.type || 'In-Person'} consultation • {appt.specialization || 'Cardiology'}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start">
            {appt.type === 'Video Consultation' && ['Confirmed', 'Scheduled', 'Completed'].includes(appt.status) && (
              <button
                onClick={() => navigate(`/appointments/${appt.id}/video`)}
                className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors flex items-center space-x-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Telehealth Call</span>
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="px-3 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => setShowNotes(true)}
                className="px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { icon: Stethoscope, label: 'Doctor', val: appt.doctorName || 'Dr. Sarah Jenkins', color: 'text-primary' },
            { icon: Calendar, label: 'Date', val: formatAppointmentDate(appt.date), color: 'text-healing-500' },
            { icon: Clock, label: 'Time', val: appt.slotTime || '10:30 AM', color: 'text-indigo-500' },
            { icon: DollarSign, label: 'Fee', val: `$${appt.consultationFee || 120}`, color: 'text-emerald-500' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
              <span className={`text-[10px] text-muted-foreground flex items-center space-x-1`}>
                <Icon className={`w-3 h-3 ${color}`} />
                <span>{label}</span>
              </span>
              <p className="font-bold text-foreground">{val}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 text-xs space-y-1">
          <span className="font-semibold text-foreground flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>Reason for Visit</span>
          </span>
          <p className="text-muted-foreground leading-relaxed">{appt.reason || 'Routine health consultation'}</p>
        </div>

        {appt.clinicalNotes && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
            <span className="font-semibold text-primary">Clinical Notes</span>
            <p className="text-muted-foreground leading-relaxed">{appt.clinicalNotes}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <AppointmentTimeline status={appt.status} />

      {/* Complete notes modal inline */}
      {showNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Clinical Completion Notes</h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical observations, prescriptions issued, follow-up plan..."
              className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none"
            />
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowNotes(false)}
                className="px-3 py-2 bg-card border border-border/60 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  completeMutation.mutate(notes, { onSuccess: () => setShowNotes(false) });
                }}
                disabled={completeMutation.isPending}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-60"
              >
                {completeMutation.isPending ? 'Saving...' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CancelAppointmentDialog
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={({ id: _id, reason }) => cancelMutation.mutate({ id: appt.id, reason }, { onSuccess: () => setShowCancel(false) })}
        appointmentId={appt.id}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
};

export default AppointmentDetailsPage;
