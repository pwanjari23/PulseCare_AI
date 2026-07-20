import React from 'react';
import { Activity, Database, Server, Mail, HardDrive, Cpu } from 'lucide-react';
import { getSystemHealthStyle } from './dashboard.utils';

export const SystemHealthCard = ({ health }) => {
  const info = health || {
    apiStatus: 'UP',
    databaseStatus: 'UP',
    storageUsage: '34%',
    emailService: 'UP',
    backgroundJobs: 'UP',
    version: 'v1.4.2',
    memoryUsageMB: 142,
  };

  const services = [
    { name: 'REST API Gateway', status: info.apiStatus, icon: Server },
    { name: 'PostgreSQL Database', status: info.databaseStatus, icon: Database },
    { name: 'SMTP Email Service', status: info.emailService, icon: Mail },
    { name: 'Background Workers', status: info.backgroundJobs, icon: Cpu },
  ];

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold text-foreground font-display">System Health Telemetry</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          99.98% Uptime
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-3 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-bold text-foreground">{s.name}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getSystemHealthStyle(s.status)}`}>
                {s.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 text-xs font-mono text-muted-foreground border-t border-border/40">
        <span className="flex items-center space-x-1">
          <HardDrive className="w-3.5 h-3.5 text-primary" />
          <span>Storage: {info.storageUsage}</span>
        </span>
        <span>Heap Memory: {info.memoryUsageMB} MB</span>
      </div>
    </div>
  );
};

export default SystemHealthCard;
