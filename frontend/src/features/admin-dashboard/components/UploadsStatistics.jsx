/**
 * PulseCare AI - UploadsStatistics Component
 */

import React from 'react';
import { Upload, HardDrive, FileText, Image } from 'lucide-react';

export const UploadsStatistics = ({ className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Upload className="w-4 h-4 text-purple-500" /> Clinical File Storage Telemetry
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Storage Used</span>
          <p className="text-lg font-black text-foreground font-mono">1.42 GB</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Medical Files Uploaded</span>
          <p className="text-lg font-black text-foreground font-mono">340 Files</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Storage Quota</span>
          <p className="text-lg font-black text-emerald-500 font-mono">14.2% Used</p>
        </div>
      </div>
    </div>
  );
};

export default UploadsStatistics;
