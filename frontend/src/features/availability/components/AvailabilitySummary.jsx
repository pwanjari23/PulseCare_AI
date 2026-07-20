import React from 'react';
import { CalendarDays, Clock, TrendingUp, Sunrise } from 'lucide-react';
import {
  getWorkingDaysCount,
  getTotalWeeklyHours,
  getNextWorkingDay,
  getTodaySchedule,
  formatTimeDisplay,
  formatDuration,
  getDurationMinutes,
} from '../utils/availability.utils';

export const AvailabilitySummary = ({ schedule = [] }) => {
  const workingDays = getWorkingDaysCount(schedule);
  const weeklyHours = getTotalWeeklyHours(schedule);
  const nextDay = getNextWorkingDay(schedule);
  const today = getTodaySchedule(schedule);

  const stats = [
    {
      icon: CalendarDays,
      label: 'Working Days',
      value: workingDays,
      sub: `of 7 days per week`,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      icon: Clock,
      label: 'Weekly Hours',
      value: `${weeklyHours}h`,
      sub: 'total consultation time',
      color: 'text-healing-500 bg-healing-500/10 border-healing-500/20',
    },
    {
      icon: Sunrise,
      label: "Today's Schedule",
      value: today
        ? `${formatTimeDisplay(today.startTime)} – ${formatTimeDisplay(today.endTime)}`
        : 'Day off',
      sub: today ? formatDuration(getDurationMinutes(today.startTime, today.endTime)) : 'Not working today',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Next Working Day',
      value: nextDay || 'None set',
      sub: workingDays === 0 ? 'Add schedule first' : 'upcoming',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, sub, color }) => (
        <div
          key={label}
          className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm space-y-2 hover:border-border transition-colors"
        >
          <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider">{label}</p>
            <p className="text-base font-extrabold text-foreground font-display leading-tight truncate">{value}</p>
            <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailabilitySummary;
