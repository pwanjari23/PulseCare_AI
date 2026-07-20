import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppointmentStatusBadge from './AppointmentStatusBadge';

export const AppointmentCalendarView = ({ appointments = [] }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  // Map appointments by day number
  const getAppointmentsForDay = (day) => {
    return appointments.filter((app) => {
      const appDate = new Date(app.scheduledAt || app.date);
      return (
        appDate.getFullYear() === year &&
        appDate.getMonth() === month &&
        appDate.getDate() === day
      );
    });
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={today}
            className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-xl border border-border/60 hover:bg-accent/80 transition-colors"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 bg-accent text-accent-foreground rounded-xl border border-border/60 hover:bg-accent/80 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-accent text-accent-foreground rounded-xl border border-border/60 hover:bg-accent/80 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Grid Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-extrabold uppercase text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty leading slots */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 sm:h-28 rounded-xl bg-accent/10 border border-transparent" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayAppointments = getAppointmentsForDay(day);
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={day}
              className={`h-24 sm:h-28 rounded-xl p-1.5 border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/30'
                  : 'bg-card border-border/40 hover:border-border/80'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`font-bold w-5 h-5 flex items-center justify-center rounded-full text-[11px] ${
                    isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="text-[10px] font-mono font-semibold text-primary">
                    {dayAppointments.length} appt
                  </span>
                )}
              </div>

              {/* Event items */}
              <div className="flex-1 overflow-y-auto space-y-1 my-1 custom-scrollbar">
                {dayAppointments.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigate(`/appointments/${app.id}`)}
                    className="w-full text-left p-1 rounded bg-accent/60 hover:bg-accent border border-border/40 text-[10px] truncate block font-medium transition-colors"
                  >
                    <div className="truncate font-semibold text-foreground">
                      {app.Doctor?.lastName ? `Dr. ${app.Doctor.lastName}` : app.doctorName || 'Consultation'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendarView;
