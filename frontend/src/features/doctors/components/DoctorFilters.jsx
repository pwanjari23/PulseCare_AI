import React from 'react';
import { Filter } from 'lucide-react';
import { DOCTOR_FILTERS } from '../constants/doctor.constants';

export const DoctorFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto py-1 custom-scrollbar">
      <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1 shrink-0" />
      {DOCTOR_FILTERS.map((f) => {
        const isSelected = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
                : 'bg-card border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};

export default DoctorFilters;
