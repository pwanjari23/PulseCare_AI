/**
 * PulseCare AI - SettingsEmptyState Component
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SettingsEmptyState = ({ title = 'No Data Found', description = 'There are no records matching your query.' }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-10 text-center space-y-3 font-sans max-w-md mx-auto my-12 shadow-xs">
      <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default SettingsEmptyState;
