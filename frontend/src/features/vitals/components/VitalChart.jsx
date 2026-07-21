import React from 'react';
import { VITAL_METRICS } from '../constants/vital.constants';

export const VitalChart = ({
  metricKey = 'HEART_RATE',
  data = [],
  title,
  height = 180,
}) => {
  const metricConfig = VITAL_METRICS[metricKey] || VITAL_METRICS.HEART_RATE;

  // Extract plot values
  const points = data.map((item, idx) => {
    const rawVal = item[metricConfig.key] || item.heartRate || item.systolicBp || 70;
    const dateLabel = new Date(item.loggedAt || item.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });
    return { val: Number(rawVal), label: dateLabel || `Reading ${idx + 1}` };
  });

  const displayPoints = points.length > 0 ? points : [
    { label: 'Day 1', val: 72 },
    { label: 'Day 2', val: 75 },
    { label: 'Day 3', val: 71 },
    { label: 'Day 4', val: 80 },
    { label: 'Day 5', val: 74 },
  ];

  const minVal = Math.min(...displayPoints.map((p) => p.val), metricConfig.normalRange?.min || 50);
  const maxVal = Math.max(...displayPoints.map((p) => p.val), metricConfig.normalRange?.max || 120);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {title || metricConfig.label} Trend
        </h4>
        <span className="text-[11px] font-mono font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          {metricConfig.unit}
        </span>
      </div>

      <div className="p-3 bg-accent/20 rounded-2xl border border-border/40 space-y-2">
        <div style={{ height: `${height}px` }} className="flex items-end justify-between gap-2 pt-2 px-1">
          {displayPoints.map((pt, i) => {
            const range = maxVal - minVal || 1;
            const pct = Math.min(100, Math.max(15, ((pt.val - minVal) / range) * 100));

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {pt.val}
                </span>
                <div
                  style={{ height: `${pct}%`, backgroundColor: metricConfig.hex }}
                  className="w-full max-w-[24px] rounded-t-md opacity-80 group-hover:opacity-100 transition-all shadow-2xs"
                />
                <span className="text-[9px] font-mono text-muted-foreground truncate">{pt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VitalChart;
