import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const HolidayCalendar = ({ holidays = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const holidayMap = {};
  holidays.forEach((h) => {
    holidayMap[h.date] = h;
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-foreground font-display">{MONTHS[month]} {year}</h3>
        <div className="flex items-center space-x-1">
          <button onClick={() => setCurrent(new Date(year, month - 1, 1))} className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground" aria-label="Previous month">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))} className="px-3 py-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg">Today</button>
          <button onClick={() => setCurrent(new Date(year, month + 1, 1))} className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground" aria-label="Next month">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-[11px] font-mono font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-10" />;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const holiday = holidayMap[dateKey];
          const isToday = new Date(year, month, day).toDateString() === today.toDateString();

          return (
            <div
              key={day}
              className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-colors relative group cursor-default ${
                holiday
                  ? 'bg-rose-500/15 border border-rose-500/25 text-rose-500 font-bold'
                  : isToday
                  ? 'bg-primary text-primary-foreground font-extrabold'
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
              title={holiday?.reason}
            >
              <span>{day}</span>
              {holiday && <span className="text-[7px] leading-none opacity-70 truncate max-w-full px-0.5">{holiday.reason?.slice(0, 6)}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HolidayCalendar;
