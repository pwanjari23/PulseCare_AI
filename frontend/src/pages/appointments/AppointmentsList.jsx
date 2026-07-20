import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Table as TableIcon, Calendar, SearchX } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useAppointments } from '../../hooks/useAppointments';
import {
  AppointmentCard,
  AppointmentTable,
  AppointmentFilter,
  AppointmentSearch,
  CancelAppointmentDialog,
  CompleteAppointmentDialog,
} from '../../components/appointments';

export const AppointmentsList = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';

  const [activeStatus, setActiveStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedCancelApp, setSelectedCancelApp] = useState(null);
  const [selectedCompleteApp, setSelectedCompleteApp] = useState(null);

  const { data, isLoading } = useAppointments();

  // Mock list fallback if API data is empty during development preview
  const rawList = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) return data;
    if (data && data.appointments && Array.isArray(data.appointments)) return data.appointments;
    return [
      {
        id: 101,
        Doctor: { firstName: 'Sarah', lastName: 'Jenkins' },
        Patient: { firstName: 'John', lastName: 'Doe' },
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        status: 'Confirmed',
        reason: 'Routine cardiology follow-up and blood pressure check',
        specialization: 'Cardiology',
      },
      {
        id: 102,
        Doctor: { firstName: 'Marcus', lastName: 'Vance' },
        Patient: { firstName: 'Emma', lastName: 'Watson' },
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        status: 'Scheduled',
        reason: 'Headache & neurology consultation',
        specialization: 'Neurology',
      },
      {
        id: 103,
        Doctor: { firstName: 'Elena', lastName: 'Rostova' },
        Patient: { firstName: 'Robert', lastName: 'Downey' },
        scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'Completed',
        reason: 'Pediatric checkup and vaccine log',
        specialization: 'Pediatrics',
      },
    ];
  }, [data]);

  // Filtered List
  const filteredAppointments = useMemo(() => {
    return rawList.filter((app) => {
      const statusMatch =
        activeStatus === 'all' || app.status?.toLowerCase() === activeStatus;

      const docName = `${app.Doctor?.firstName || ''} ${app.Doctor?.lastName || ''}`.toLowerCase();
      const patName = `${app.Patient?.firstName || ''} ${app.Patient?.lastName || ''}`.toLowerCase();
      const reasonStr = (app.reason || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      const searchMatch =
        !searchTerm ||
        docName.includes(search) ||
        patName.includes(search) ||
        reasonStr.includes(search);

      return statusMatch && searchMatch;
    });
  }, [rawList, activeStatus, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display">Appointments</h2>
          <p className="text-xs text-muted-foreground">Manage and track scheduled consultations</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/appointments/calendar"
            className="px-3 py-2 bg-card border border-border/60 hover:bg-accent text-xs font-semibold rounded-xl text-foreground transition-colors flex items-center space-x-1.5"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Calendar View</span>
          </Link>

          {isPatient && (
            <Link
              to="/appointments/book"
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
        <AppointmentFilter activeStatus={activeStatus} onStatusChange={setActiveStatus} />

        <div className="flex items-center space-x-3 justify-between sm:justify-end">
          <AppointmentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'cards' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-card border border-border/60 rounded-2xl animate-pulse p-4 space-y-3">
              <div className="h-4 bg-accent rounded-md w-1/3" />
              <div className="h-8 bg-accent rounded-md w-3/4" />
              <div className="h-10 bg-accent rounded-md w-full" />
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        /* Empty State */
        <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Appointments Found</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No appointments match your active filter or search criteria.
          </p>
          {isPatient && (
            <Link
              to="/appointments/book"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <AppointmentTable
          appointments={filteredAppointments}
          role={role}
          onCancel={(app) => setSelectedCancelApp(app)}
          onComplete={(app) => setSelectedCompleteApp(app)}
        />
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((app) => (
            <AppointmentCard
              key={app.id}
              appointment={app}
              role={role}
              onCancel={(appItem) => setSelectedCancelApp(appItem)}
              onComplete={(appItem) => setSelectedCompleteApp(appItem)}
            />
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      <CancelAppointmentDialog
        appointment={selectedCancelApp}
        isOpen={!!selectedCancelApp}
        onClose={() => setSelectedCancelApp(null)}
      />

      {/* Complete Dialog */}
      <CompleteAppointmentDialog
        appointment={selectedCompleteApp}
        isOpen={!!selectedCompleteApp}
        onClose={() => setSelectedCompleteApp(null)}
      />
    </div>
  );
};

export default AppointmentsList;
