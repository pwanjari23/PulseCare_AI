import React from 'react';
import { Activity, Heart, Thermometer, ShieldCheck, Zap } from 'lucide-react';

export const HealthOverviewCard = () => {
  const metrics = [
    { label: 'Heart Rate', value: '72 BPM', status: 'Normal', color: 'text-rose-500', icon: Heart },
    { label: 'Blood Pressure', value: '120/80 mmHg', status: 'Optimal', color: 'text-emerald-500', icon: Activity },
    { label: 'SpO2 Oxygen', value: '98%', status: 'Normal', color: 'text-healing-500', icon: Zap },
    { label: 'Body Temp', value: '98.6 °F', status: 'Normal', color: 'text-amber-500', icon: Thermometer },
  ];

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-healing-500 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground">Vitals Telemetry Overview</h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Synced</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-3 rounded-xl bg-accent/30 border border-border/40 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span className="font-semibold">{m.label}</span>
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <p className="text-lg font-extrabold text-foreground font-display">{m.value}</p>
              <span className="text-[10px] font-semibold text-emerald-500 block">{m.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthOverviewCard;
