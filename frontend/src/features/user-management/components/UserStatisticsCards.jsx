/**
 * PulseCare AI - UserStatisticsCards Component
 */

import React from 'react';
import { Users, Stethoscope, User, ShieldCheck, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserStatisticsCards = ({ stats = {}, className = '' }) => {
  const cards = [
    { label: 'Total Platform Users', val: stats.totalUsers || 0, icon: Users, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    { label: 'Verified Doctors', val: stats.totalDoctors || 0, icon: Stethoscope, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Registered Patients', val: stats.totalPatients || 0, icon: User, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Administrators', val: stats.totalAdmins || 0, icon: ShieldCheck, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { label: 'Pending Approvals', val: stats.pendingApprovals || 0, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', highlight: true },
    { label: 'Active Users', val: stats.activeUsers || 0, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Inactive Users', val: stats.inactiveUsers || 0, icon: Clock, color: 'text-gray-500 bg-gray-500/10 border-gray-500/20' },
    { label: 'Suspended Users', val: stats.suspendedUsers || 0, icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-sans ${className}`}>
      {cards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            className={`p-3.5 bg-card border rounded-2xl shadow-2xs space-y-1 ${
              card.highlight ? 'border-amber-500/40 bg-amber-500/5' : 'border-border/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold text-muted-foreground truncate">{card.label}</span>
              <div className={`p-1.5 rounded-xl border ${card.color}`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-lg font-black text-foreground font-mono">{card.val}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserStatisticsCards;
