/**
 * PulseCare AI - DoctorPerformance Component
 */

import React from 'react';
import { Stethoscope, Star, Award, CheckCircle2 } from 'lucide-react';

export const DoctorPerformance = ({ data, className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Stethoscope className="w-4 h-4 text-emerald-500" /> Doctor Clinical Throughput
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Verified Doctors</span>
          <p className="text-lg font-black text-foreground font-mono">{data?.totalDoctors || 0}</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Avg Consultation Time</span>
          <p className="text-lg font-black text-foreground font-mono">18 mins</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Patient Satisfaction Score</span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
            4.9 / 5.0 <Star className="w-3.5 h-3.5 fill-current" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorPerformance;
