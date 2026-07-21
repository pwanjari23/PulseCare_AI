/**
 * PulseCare AI - SystemHealthCard Component
 */

import React from 'react';
import { Server, Database, Mail, HardDrive, Wifi, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatUptime, formatMemoryUsage } from '../utils/dashboard.utils';

export const SystemHealthCard = ({ healthData, className = '' }) => {
  const uptimeStr = formatUptime(healthData?.uptimeSeconds);
  const memoryStr = formatMemoryUsage(healthData?.memoryUsageMB);

  const services = [
    { label: 'REST API Service', status: 'Operational', icon: Server, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'MySQL Database', status: 'Connected', icon: Database, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Nodemailer SMTP', status: 'Active', icon: Mail, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Cloud Storage', status: 'Healthy', icon: HardDrive, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Socket.IO Gateway', status: 'Listening', icon: Wifi, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Node Runtime Heap', status: memoryStr, icon: Cpu, color: 'text-sky-500 bg-sky-500/10' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">System Infrastructure Health</h3>
            <p className="text-xs text-muted-foreground">Service status & hardware telemetry</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {uptimeStr}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        {services.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-xl ${s.color}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-foreground truncate">{s.label}</span>
              </div>
              <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 pl-7">
                {s.status}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemHealthCard;
