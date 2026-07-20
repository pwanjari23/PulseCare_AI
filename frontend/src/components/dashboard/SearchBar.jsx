import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="relative hidden md:block w-64 lg:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder="Search patients, vitals, appointments..."
        className="w-full pl-9 pr-12 py-1.5 bg-accent/50 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-card border border-border/60 rounded shadow-2xs">
          Ctrl K
        </kbd>
      </div>
    </div>
  );
};

export default SearchBar;
