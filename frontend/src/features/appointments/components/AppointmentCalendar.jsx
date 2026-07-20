import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { formatAppointmentDate } from '../utils/appointment.utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const AppointmentCalendar = ({ appointments = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const appointmentsByDate = {};
  appointments.forEach((appt) => {
    const key = appt.date;
    if (key) {
      if (!appointmentsByDate[key]) appointmentsByDate[key] = [];
      appointmentsByDate[key].push(appt);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-foreground font-display">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="px-3 py-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-[11px] font-mono font-bold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="h-14" />;

          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayAppts = appointmentsByDate[dateKey] || [];
          const isToday =
            today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

          return (
            <div
              key={day}
              className={`h-14 p-1 rounded-xl border text-xs transition-colors cursor-pointer ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : 'border-border/40 hover:bg-accent/50'
              }`}
            >
              <span className={`block text-right text-[11px] font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                {day}
              </span>
              <div className="space-y-0.5 overflow-hidden">
                {dayAppts.slice(0, 2).map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full h-1.5 rounded-full bg-primary/60"
                    title={`${a.slotTime} - ${a.doctorName}`}
                  />
                ))}
                {dayAppts.length > 2 && (
                  <span className="text-[9px] text-muted-foreground">+{dayAppts.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
