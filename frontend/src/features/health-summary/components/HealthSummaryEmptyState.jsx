/**
 * PulseCare AI - HealthSummaryEmptyState Component
 */

import React from 'react';
import { Sparkles, Activity, Plus } from 'lucide-react';

export const HealthSummaryEmptyState = ({ title = 'No AI Health Summary Available', description = 'Generate a new AI health assessment or log initial patient vitals to unlock insights.', onGenerate, canGenerate = false }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-10 text-center space-y-4 font-sans max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
        <Sparkles className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {canGenerate && onGenerate && (
        <button
          onClick={onGenerate}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all hover:shadow-md mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate AI Assessment</span>
        </button>
      )}
    </div>
  );
};

export default HealthSummaryEmptyState;
