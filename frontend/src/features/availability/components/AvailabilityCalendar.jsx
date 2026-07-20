import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WEEK_DAYS } from '../constants/availability.constants';
import { isAvailableOnDate } from '../utils/availability.utils';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const AvailabilityCalendar = ({ schedule = [], holidays = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const holidaySet = new Set(holidays.map((h) => h.date));

  const getCellStyle = (day) => {
    const date = new Date(year, month, day);
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = date.toDateString() === today.toDateString();
    const isHoliday = holidaySet.has(dateKey);
    const isWorking = isAvailableOnDate(schedule, date);

    if (isToday && isWorking) return 'bg-primary text-primary-foreground font-extrabold ring-2 ring-primary/30';
    if (isToday) return 'ring-2 ring-primary/40 font-extrabold text-primary';
    if (isHoliday) return 'bg-rose-500/15 text-rose-500 font-bold border border-rose-500/25';
    if (isWorking) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20';
    return 'text-muted-foreground';
  };

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
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground"
            aria-label="Previous month"
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
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-[11px] font-mono font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-10" />;
          return (
            <div
              key={day}
              className={`h-10 rounded-xl flex items-center justify-center text-xs cursor-default transition-colors ${getCellStyle(day)}`}
              aria-label={`${MONTHS[month]} ${day}, ${year}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" /><span>Working day</span></span>
        <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-sm bg-rose-500/15 border border-rose-500/25" /><span>Holiday</span></span>
        <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-sm bg-primary border border-primary/30" /><span>Today</span></span>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
