/**
 * PulseCare AI - UserStatistics Component
 */

import React from 'react';
import { Users, Stethoscope, User, ShieldCheck, UserCheck } from 'lucide-react';
import { formatNumber } from '../utils/dashboard.utils';

export const UserStatistics = ({ data, className = '' }) => {
  const stats = [
    { label: 'Total Accounts', val: data?.totalUsers || 0, icon: Users, color: 'text-sky-500 bg-sky-500/10' },
    { label: 'Verified Doctors', val: data?.totalDoctors || 0, icon: Stethoscope, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Registered Patients', val: data?.totalPatients || 0, icon: User, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Active Admins', val: 2, icon: ShieldCheck, color: 'text-purple-500 bg-purple-500/10' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Users className="w-4 h-4 text-sky-500" /> User Ecosystem Breakdown
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-xl ${s.color}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold truncate">{s.label}</span>
              </div>
              <p className="text-lg font-black text-foreground font-mono pl-7">{formatNumber(s.val)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserStatistics;
