/**
 * PulseCare AI - AnalyticsOverview Component
 */

import React from 'react';
import { Activity, BarChart3, TrendingUp, Users, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsOverview = ({ data, className = '' }) => {
  const totalUsers = (data?.totalPatients || 0) + (data?.totalDoctors || 0) || 100;
  const doctorPercent = Math.round(((data?.totalDoctors || 1) / totalUsers) * 100);
  const patientPercent = Math.round(((data?.totalPatients || 1) / totalUsers) * 100);

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Platform Analytical Overview</h3>
            <p className="text-xs text-muted-foreground">Demographic ratios & consultation efficiency</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        {/* User Ratio */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-muted-foreground">User Distribution</span>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-500">{doctorPercent}% Doctors</span>
            <span className="text-sky-500">{patientPercent}% Patients</span>
          </div>
          <div className="w-full h-3 bg-accent/60 rounded-full flex overflow-hidden p-0.5">
            <div className="bg-emerald-500 rounded-l-full h-full" style={{ width: `${doctorPercent}%` }} />
            <div className="bg-sky-500 rounded-r-full h-full" style={{ width: `${patientPercent}%` }} />
          </div>
        </div>

        {/* Clinical Activity */}
        <div className="space-y-2 sm:border-l border-border/40 sm:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">Clinical Activity</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-foreground font-mono">{data?.todayAppointmentsCount || 0}</span>
            <span className="text-xs text-muted-foreground">Consultations Today</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            +14% volume vs last week
          </p>
        </div>

        {/* System Load */}
        <div className="space-y-2 sm:border-l border-border/40 sm:pl-6">
          <span className="text-xs font-mono uppercase text-muted-foreground">Platform Infrastructure</span>
          <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>99.98% Service Uptime</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            Heap: {data?.systemStats?.memoryUsageMB || 128} MB Memory
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
