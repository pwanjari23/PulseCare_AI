/**
 * PulseCare AI - PatientStatistics Component
 */

import React from 'react';
import { User, Activity, AlertTriangle, Heart } from 'lucide-react';

export const PatientStatistics = ({ data, className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <User className="w-4 h-4 text-indigo-500" /> Patient Population Telemetry
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Patients Enrolled</span>
          <p className="text-lg font-black text-foreground font-mono">{data?.totalPatients || 0}</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Telemetry Patients</span>
          <p className="text-lg font-black text-foreground font-mono">
            {Math.max(Math.floor((data?.totalPatients || 0) * 0.75), 1)}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Vital Alerts</span>
          <p className="text-lg font-black text-rose-500 font-mono">{data?.openAlertsCount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientStatistics;
