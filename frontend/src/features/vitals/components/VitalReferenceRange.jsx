import React from 'react';
import { Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { VITAL_METRICS } from '../constants/vital.constants';

export const VitalReferenceRange = () => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center space-x-2">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground font-display">Clinical Reference Ranges</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {Object.keys(VITAL_METRICS).map((key) => {
          const m = VITAL_METRICS[key];
          if (!m.normalRange) return null;

          return (
            <div key={key} className="p-3 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
              <span className="font-bold text-foreground block">{m.label}</span>
              <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                <span>Normal:</span>
                <span className="text-emerald-500 font-bold">{m.normalRange.min} – {m.normalRange.max} {m.unit}</span>
              </div>
              {m.warningRange && (
                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                  <span>Warning:</span>
                  <span className="text-amber-500 font-bold">{m.warningRange.min} – {m.warningRange.max} {m.unit}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalReferenceRange;
