import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { NOTIFICATION_FILTERS } from './notification.constants';

export const NotificationFilter = ({ activeFilter, onFilterChange, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 custom-scrollbar">
        <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1 shrink-0" />
        {NOTIFICATION_FILTERS.map((f) => {
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

      {/* Search Input */}
      <div className="relative w-full sm:w-60 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notifications..."
          className="w-full pl-9 pr-8 py-1.5 bg-accent/40 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationFilter;
