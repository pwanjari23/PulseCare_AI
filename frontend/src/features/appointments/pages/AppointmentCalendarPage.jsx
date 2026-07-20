import React, { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useAppointments } from '../hooks/useAppointments';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import { useDoctorAppointments } from '../hooks/useDoctorAppointments';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AppointmentSkeleton from '../components/AppointmentSkeleton';

export const AppointmentCalendarPage = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';

  const adminQuery = useAppointments();
  const patientQuery = usePatientAppointments();
  const doctorQuery = useDoctorAppointments();

  const query = isPatient ? patientQuery : isDoctor ? doctorQuery : adminQuery;
  const { data, isLoading } = query;

  const appointments = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.appointments) return data.appointments;
    return [];
  }, [data]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display flex items-center space-x-2">
          <CalendarDays className="w-7 h-7 text-primary" />
          <span>Appointment Calendar</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Visual overview of your scheduled appointments by month.
        </p>
      </div>

      {isLoading ? (
        <AppointmentSkeleton count={1} />
      ) : (
        <AppointmentCalendar appointments={appointments} />
      )}

      {/* Legend */}
      <div className="flex items-center space-x-4 text-xs text-muted-foreground bg-card border border-border/60 rounded-2xl p-4">
        <span className="font-semibold text-foreground">Legend:</span>
        <span className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-primary/60" />
          <span>Scheduled Appointment</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full border border-primary" />
          <span>Today</span>
        </span>
      </div>
    </div>
  );
};

export default AppointmentCalendarPage;
