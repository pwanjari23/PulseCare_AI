import React, { useState, useMemo } from 'react';
import { Stethoscope, CheckCircle2, Clock } from 'lucide-react';
import { useDoctorAppointments } from '../hooks/useDoctorAppointments';
import { useUpdateAppointment } from '../hooks/useUpdateAppointment';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentEmptyState from '../components/AppointmentEmptyState';
import AppointmentSkeleton from '../components/AppointmentSkeleton';
import CancelAppointmentDialog from '../components/CancelAppointmentDialog';

const TABS = [
  { id: 'Today', label: "Today's Visits", icon: Clock },
  { id: 'Upcoming', label: 'Upcoming', icon: Stethoscope },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
];

export const DoctorAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useDoctorAppointments();
  const completeMutation = useUpdateAppointment(completeTarget?.id);
  const cancelMutation = useCancelAppointment();

  const today = new Date().toISOString().split('T')[0];

  const allAppointments = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.appointments) return data.appointments;
    return [];
  }, [data]);

  const filtered = useMemo(() => {
    if (activeTab === 'Today') return allAppointments.filter((a) => a.date === today);
    if (activeTab === 'Upcoming') return allAppointments.filter((a) => a.date > today && !['Cancelled', 'Completed'].includes(a.status));
    if (activeTab === 'Completed') return allAppointments.filter((a) => a.status === 'Completed');
    return allAppointments;
  }, [allAppointments, activeTab, today]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display flex items-center space-x-2">
          <Stethoscope className="w-7 h-7 text-primary" />
          <span>My Appointment Schedule</span>
        </h1>
        <p className="text-xs text-muted-foreground">Manage your daily clinical appointments and patient visits.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-card border border-border/60 p-1 rounded-2xl shadow-xs w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === id ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <AppointmentSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <AppointmentEmptyState
          title={`No ${activeTab} Appointments`}
          description={`You have no ${activeTab.toLowerCase()} appointments in your schedule.`}
        />
      ) : (
        <AppointmentTable
          appointments={filtered}
          isDoctor={true}
          onComplete={(a) => setCompleteTarget(a)}
          onCancel={(a) => setSelectedAppt(a)}
        />
      )}

      {/* Complete notes modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Complete Appointment – Clinical Notes</h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add consultation notes, prescriptions, or follow-up instructions..."
              className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none"
            />
            <div className="flex space-x-3 justify-end">
              <button onClick={() => setCompleteTarget(null)} className="px-3 py-2 bg-card border text-xs rounded-xl">Cancel</button>
              <button
                onClick={() => completeMutation.mutate(notes, { onSuccess: () => { setCompleteTarget(null); setNotes(''); } })}
                disabled={completeMutation.isPending}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-60"
              >
                {completeMutation.isPending ? 'Saving...' : 'Mark Completed'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CancelAppointmentDialog
        isOpen={!!selectedAppt}
        onClose={() => setSelectedAppt(null)}
        onConfirm={({ id, reason }) => cancelMutation.mutate({ id, reason }, { onSuccess: () => setSelectedAppt(null) })}
        appointmentId={selectedAppt?.id}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
};

export default DoctorAppointmentsPage;
