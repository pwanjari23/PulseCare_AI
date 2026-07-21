/**
 * PulseCare AI - SecurityCard Component
 */

import React from 'react';
import { ShieldCheck, Lock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export const SecurityCard = ({ activeSessionCount = 2, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground font-display">Security Shield Status</h3>
          <p className="text-xs text-muted-foreground">Account security & multi-factor protection active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-border/40">
        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground text-[10px] uppercase">Password Status</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">Strong & Protected</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground text-[10px] uppercase">Active Sessions</span>
          <p className="font-bold text-foreground">{activeSessionCount} Authorized Device(s)</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground text-[10px] uppercase">Two-Factor Authentication</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">Enabled (Authenticator)</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityCard;
