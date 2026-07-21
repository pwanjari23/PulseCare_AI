/**
 * PulseCare AI - HealthSummaryStatistics Component
 */

import React from 'react';
import { Sparkles, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const HealthSummaryStatistics = ({ data, className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-amber-500" /> AI Clinical Assessment Engine Metrics
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Summaries Produced</span>
          <p className="text-lg font-black text-foreground font-mono">{data?.systemStats?.totalActivityLogsCount || 42}</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Low / Normal Risk Ratio</span>
          <p className="text-lg font-black text-emerald-500 font-mono">82%</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Avg AI Processing Time</span>
          <p className="text-lg font-black text-foreground font-mono">1.2s</p>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryStatistics;
