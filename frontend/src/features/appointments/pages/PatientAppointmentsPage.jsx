import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, History, Plus } from 'lucide-react';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentEmptyState from '../components/AppointmentEmptyState';
import AppointmentSkeleton from '../components/AppointmentSkeleton';
import CancelAppointmentDialog from '../components/CancelAppointmentDialog';

const TABS = [
  { id: 'Upcoming', label: 'Upcoming', icon: Clock },
  { id: 'Past', label: 'Past', icon: History },
  { id: 'Cancelled', label: 'Cancelled', icon: Calendar },
];

export const PatientAppointmentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedAppt, setSelectedAppt] = useState(null);

  const { data, isLoading } = usePatientAppointments();
  const cancelMutation = useCancelAppointment();

  const today = new Date().toISOString().split('T')[0];

  const allAppointments = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.appointments && Array.isArray(data.appointments)) return data.appointments;
    return [];
  }, [data]);

  const filtered = useMemo(() => {
    return allAppointments.filter((a) => {
      const apptDate = a.date || (a.scheduledAt ? a.scheduledAt.split('T')[0] : '');
      const isUpcoming = (apptDate >= today || !apptDate) && !['Cancelled', 'Completed'].includes(a.status);
      const isPast = (apptDate < today && apptDate !== '') || a.status === 'Completed';
      const isCancelled = a.status === 'Cancelled';

      if (activeTab === 'Upcoming') return isUpcoming;
      if (activeTab === 'Past') return isPast;
      if (activeTab === 'Cancelled') return isCancelled;
      return true;
    });
  }, [allAppointments, activeTab, today]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-primary" />
            <span>My Appointments</span>
          </h1>
          <p className="text-xs text-muted-foreground">Track your upcoming and past medical consultations.</p>
        </div>

        <button
          onClick={() => navigate('/appointments/book')}
          className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
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
          description={
            activeTab === 'Upcoming'
              ? 'You have no upcoming appointments. Book a new consultation to get started.'
              : `No ${activeTab.toLowerCase()} appointment records found.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancel={(a) => setSelectedAppt(a)}
              canCancel={activeTab === 'Upcoming'}
            />
          ))}
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

export default PatientAppointmentsPage;
