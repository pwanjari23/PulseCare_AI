import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Heart, Scale, Zap } from 'lucide-react';
import { CHART_METRICS } from './dashboard.constants';

export const HealthTrendChart = ({ vitals = [] }) => {
  const [activeMetric, setActiveMetric] = useState('bp');

  // Sample 30-day telemetry plot data
  const plotData = [
    { date: 'Day 1', bp: 120, heartRate: 72, weight: 70.5, glucose: 98 },
    { date: 'Day 5', bp: 122, heartRate: 75, weight: 70.6, glucose: 102 },
    { date: 'Day 10', bp: 118, heartRate: 70, weight: 70.4, glucose: 95 },
    { date: 'Day 15', bp: 124, heartRate: 78, weight: 70.2, glucose: 105 },
    { date: 'Day 20', bp: 121, heartRate: 74, weight: 70.3, glucose: 99 },
    { date: 'Day 25', bp: 119, heartRate: 71, weight: 70.1, glucose: 97 },
    { date: 'Day 30', bp: 120, heartRate: 72, weight: 70.0, glucose: 100 },
  ];

  const activeMetricObj = CHART_METRICS.find((m) => m.id === activeMetric) || CHART_METRICS[0];

  const getMetricIcon = (id) => {
    if (id === 'bp') return Activity;
    if (id === 'heartRate') return Heart;
    if (id === 'weight') return Scale;
    return Zap;
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div>
          <h3 className="text-base font-bold text-foreground font-display">Health Trend Analytics</h3>
          <p className="text-xs text-muted-foreground">30-day physiological telemetry overview</p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 custom-scrollbar">
          {CHART_METRICS.map((m) => {
            const Icon = getMetricIcon(m.id);
            const isSelected = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-2xs'
                    : 'bg-accent/40 border-border/60 text-muted-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plotData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeMetricObj.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeMetricObj.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="rgba(150, 150, 150, 0.6)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(150, 150, 150, 0.6)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card, #1e293b)',
                borderColor: 'var(--color-border, #334155)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={activeMetricObj.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthTrendChart;
