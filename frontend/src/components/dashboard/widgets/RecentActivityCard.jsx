import React from 'react';
import { Activity, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const RecentActivityCard = ({ activities }) => {
  const defaultActivities = [
    { id: 1, title: 'Vitals Stream Synced', time: '12 mins ago', icon: Activity, color: 'text-emerald-500', desc: 'Heart rate telemetry 72 BPM received.' },
    { id: 2, title: 'Prescription Refilled', time: '2 hours ago', icon: FileText, color: 'text-primary', desc: 'Dr. Sarah updated prescription dosages.' },
    { id: 3, title: 'System Security Audit', time: '5 hours ago', icon: CheckCircle2, color: 'text-indigo-500', desc: 'Encrypted OAuth session refreshed.' },
    { id: 4, title: 'Blood Pressure Warning', time: '1 day ago', icon: AlertTriangle, color: 'text-amber-500', desc: 'Systolic 135 mmHg noted in daily log.' },
  ];

  const items = activities || defaultActivities;

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
        <span className="text-[10px] font-mono uppercase text-muted-foreground">Real-time Stream</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon || Activity;
          return (
            <div key={item.id} className="flex items-start space-x-3 text-xs">
              <div className={`p-2 rounded-xl bg-accent border border-border/40 shrink-0 ${item.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
                  <span className="text-[10px] text-muted-foreground flex items-center space-x-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityCard;
