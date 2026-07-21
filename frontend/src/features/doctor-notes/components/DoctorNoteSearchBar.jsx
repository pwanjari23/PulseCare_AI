import React from 'react';
import { Search, X } from 'lucide-react';

export const DoctorNoteSearchBar = ({ value, onChange, placeholder = 'Search by code, patient, physician, diagnosis...' }) => {
  return (
    <div className="relative flex-1 max-w-md font-sans">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-card border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all shadow-xs"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default DoctorNoteSearchBar;
