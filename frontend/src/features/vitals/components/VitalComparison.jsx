import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Scale } from 'lucide-react';
import { formatBP, formatLoggedDate } from '../utils/vital.utils';

export const VitalComparison = ({ current, baseline }) => {
  if (!current || !baseline) return null;

  const compareDiff = (currVal, baseVal) => {
    if (!currVal || !baseVal) return null;
    const diff = Math.round((currVal - baseVal) * 10) / 10;
    if (diff === 0) return { label: 'No Change', icon: Minus, color: 'text-muted-foreground' };
    if (diff > 0) return { label: `+${diff}`, icon: ArrowUpRight, color: 'text-rose-500' };
    return { label: `${diff}`, icon: ArrowDownRight, color: 'text-emerald-500' };
  };

  const metrics = [
    { key: 'systolicBp', label: 'Systolic BP', unit: 'mmHg' },
    { key: 'diastolicBp', label: 'Diastolic BP', unit: 'mmHg' },
    { key: 'heartRate', label: 'Heart Rate', unit: 'BPM' },
    { key: 'oxygenLevel', label: 'SpO₂', unit: '%' },
    { key: 'temperature', label: 'Temperature', unit: '°F' },
  ];

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center space-x-2">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground font-display">Measurement Baseline Comparison</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map(({ key, label, unit }) => {
          const currVal = current[key];
          const baseVal = baseline[key];
          const diffObj = compareDiff(currVal, baseVal);

          return (
            <div key={key} className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{label}</span>
              <div className="flex items-baseline justify-between">
                <div className="space-x-1">
                  <span className="text-base font-extrabold text-foreground font-mono">{currVal || '--'}</span>
                  <span className="text-[10px] text-muted-foreground">vs {baseVal || '--'} {unit}</span>
                </div>
                {diffObj && (
                  <span className={`text-xs font-mono font-bold flex items-center ${diffObj.color}`}>
                    <diffObj.icon className="w-3.5 h-3.5" />
                    <span>{diffObj.label}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalComparison;
