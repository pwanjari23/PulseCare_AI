import React from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import AppointmentCalendarView from '../../components/appointments/AppointmentCalendarView';
import { Link } from 'react-router-dom';
import { Plus, List } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

export const AppointmentCalendar = () => {
  const { user } = useAuthStore();
  const isPatient = user?.role?.toLowerCase() === 'patient';
  const { data: appointments = [] } = useAppointments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display">Appointments Calendar</h2>
          <p className="text-xs text-muted-foreground">Interactive calendar view for scheduled consultations</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/appointments"
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-xs font-semibold rounded-xl text-foreground transition-colors flex items-center space-x-1.5"
          >
            <List className="w-4 h-4 text-primary" />
            <span>List View</span>
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

      <AppointmentCalendarView appointments={Array.isArray(appointments) ? appointments : []} />
    </div>
  );
};

export default AppointmentCalendar;
