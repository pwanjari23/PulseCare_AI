import React from 'react';
import { Filter } from 'lucide-react';

export const AppointmentFilter = ({ activeStatus, onStatusChange }) => {
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-1 custom-scrollbar">
      <div className="flex items-center space-x-1 text-xs text-muted-foreground mr-1 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-semibold hidden sm:inline">Filter:</span>
      </div>

      {statuses.map((s) => {
        const isSelected = activeStatus === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                : 'bg-card border border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
};

export default AppointmentFilter;
