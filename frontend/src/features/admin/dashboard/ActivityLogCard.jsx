import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';

export const ActivityLogCard = ({ logs = [] }) => {
  const dummyLogs = [
    { id: 401, user: 'Dr. Sarah Jenkins', action: 'Completed Consultation #101', module: 'Appointments', timestamp: '5 mins ago', severity: 'Info' },
    { id: 402, user: 'John Doe', action: 'Logged Abnormal Vital (HR: 118)', module: 'Vitals', timestamp: '12 mins ago', severity: 'Warning' },
    { id: 403, user: 'Admin User', action: 'Approved Doctor Verification #19', module: 'User Management', timestamp: '1 hour ago', severity: 'Success' },
  ];

  const list = logs.length > 0 ? logs : dummyLogs;

  const getSeverityPill = (sev) => {
    const s = String(sev).toLowerCase();
    if (s === 'warning' || s === 'critical') return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    if (s === 'success') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-foreground font-display">System Audit Logs</h3>
        </div>
        <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
          Security Trail
        </span>
      </div>

      <div className="space-y-2.5">
        {list.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs"
          >
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-foreground">{log.user}</h4>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${getSeverityPill(log.severity)}`}>
                  {log.severity}
                </span>
              </div>
              <p className="text-muted-foreground text-[11px] mt-0.5">{log.action} • {log.module} • {log.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogCard;
