import React from 'react';
import { Activity, Heart, Thermometer, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { evaluateOverallTriage, formatBP } from '../utils/vital.utils';

export const VitalSummary = ({ records = [] }) => {
  const latest = records[0] || null;

  const totalLogs = records.length;
  const criticalLogs = records.filter((r) => evaluateOverallTriage(r) === 'Critical').length;
  const warningLogs = records.filter((r) => evaluateOverallTriage(r) === 'Warning').length;

  const latestBP = latest ? formatBP(latest.systolicBp, latest.diastolicBp) : 'N/A';
  const latestHR = latest?.heartRate ? `${latest.heartRate} BPM` : 'N/A';
  const latestSpO2 = latest?.oxygenLevel ? `${latest.oxygenLevel}%` : 'N/A';

  const stats = [
    {
      label: 'Total Logs',
      value: totalLogs,
      sub: 'Recorded measurements',
      icon: Activity,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      label: 'Latest BP & HR',
      value: `${latestBP} | ${latestHR}`,
      sub: 'Most recent reading',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'SpO₂ Saturation',
      value: latestSpO2,
      sub: 'Oxygen level',
      icon: Zap,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    },
    {
      label: 'Triage Alerts',
      value: `${criticalLogs} Critical / ${warningLogs} Warning`,
      sub: criticalLogs > 0 ? 'Requires attention' : 'Normal range',
      icon: criticalLogs > 0 ? AlertTriangle : CheckCircle,
      color: criticalLogs > 0 ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {stats.map(({ label, value, sub, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm space-y-2 hover:border-border transition-colors"
        >
          <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider">{label}</p>
            <p className="text-base font-extrabold text-foreground font-display leading-tight truncate">{value}</p>
            <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VitalSummary;
