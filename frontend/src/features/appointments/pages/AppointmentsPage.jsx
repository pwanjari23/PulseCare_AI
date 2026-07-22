import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useAppointments } from '../hooks/useAppointments';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentSearchBar from '../components/AppointmentSearchBar';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentEmptyState from '../components/AppointmentEmptyState';
import AppointmentSkeleton from '../components/AppointmentSkeleton';
import CancelAppointmentDialog from '../components/CancelAppointmentDialog';

export const AppointmentsPage = () => {
  const { user } = useAuthStore();
  const isDoctor = user?.role?.toLowerCase() === 'doctor';

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);

  const { data, isLoading } = useAppointments();
  const cancelMutation = useCancelAppointment();

  const appointmentsList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.appointments) return data.appointments;
    return [];
  }, [data]);

  const today = new Date().toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((appt) => {
      const apptDate = appt.date || (appt.scheduledAt ? appt.scheduledAt.split('T')[0] : '');

      let filterMatch = true;
      if (activeFilter === 'Today') filterMatch = apptDate === today;
      else if (activeFilter === 'Upcoming') filterMatch = (apptDate >= today || !apptDate) && !['Cancelled', 'Completed'].includes(appt.status);
      else if (activeFilter === 'Completed') filterMatch = appt.status === 'Completed';
      else if (activeFilter === 'Cancelled') filterMatch = appt.status === 'Cancelled';

      const s = searchTerm.toLowerCase();
      const searchMatch = !searchTerm ||
        (appt.doctorName || '').toLowerCase().includes(s) ||
        (appt.patientName || '').toLowerCase().includes(s) ||
        (appt.reason || '').toLowerCase().includes(s) ||
        String(appt.id).includes(s);

      return filterMatch && searchMatch;
    });
  }, [appointmentsList, activeFilter, searchTerm, today]);

  const handleCancelConfirm = ({ id, reason }) => {
    cancelMutation.mutate(
      { id, reason },
      { onSuccess: () => setSelectedAppt(null) }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <CalendarDays className="w-7 h-7 text-primary" />
            <span>Appointment Records</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Search, filter, and manage all scheduled clinical appointments.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-card border border-border/60 p-1 rounded-xl shadow-xs self-start sm:self-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${viewMode === 'table' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
        <AppointmentFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <AppointmentSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Content */}
      {isLoading ? (
        <AppointmentSkeleton count={3} />
      ) : filteredAppointments.length === 0 ? (
        <AppointmentEmptyState />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancel={(a) => setSelectedAppt(a)}
              canCancel={!isDoctor || appt.status === 'Pending'}
            />
          ))}
        </div>
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
          isDoctor={isDoctor}
          onCancel={(a) => setSelectedAppt(a)}
        />
      )}

      {/* Cancel Dialog */}
      <CancelAppointmentDialog
        isOpen={!!selectedAppt}
        onClose={() => setSelectedAppt(null)}
        onConfirm={handleCancelConfirm}
        appointmentId={selectedAppt?.id}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
};

export default AppointmentsPage;
