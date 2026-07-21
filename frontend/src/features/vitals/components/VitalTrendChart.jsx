import React, { useState } from 'react';
import { Activity, Heart, Thermometer, Zap, Calendar, TrendingUp } from 'lucide-react';
import { VITAL_METRICS, DATE_RANGE_OPTIONS } from '../constants/vital.constants';

export const VitalTrendChart = ({ records = [] }) => {
  const [activeMetricKey, setActiveMetricKey] = useState('HEART_RATE');
  const [dateRange, setDateRange] = useState('7');

  const selectedMetric = VITAL_METRICS[activeMetricKey] || VITAL_METRICS.HEART_RATE;

  // Filter records by date range
  const filteredRecords = records.filter((r) => {
    if (dateRange === 'all') return true;
    const days = parseInt(dateRange, 10);
    if (isNaN(days)) return true;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(r.loggedAt || r.createdAt) >= cutoff;
  });

  const chartData = filteredRecords.map((r, i) => ({
    val: r[selectedMetric.key] || (selectedMetric.key === 'heartRate' ? r.heartRate : selectedMetric.key === 'systolicBp' ? r.systolicBp : 70),
    date: new Date(r.loggedAt || r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  })).reverse();

  const displayData = chartData.length > 0 ? chartData : [
    { date: 'Mon', val: 72 },
    { date: 'Tue', val: 75 },
    { date: 'Wed', val: 70 },
    { date: 'Thu', val: 82 },
    { date: 'Fri', val: 74 },
    { date: 'Sat', val: 71 },
    { date: 'Sun', val: 73 },
  ];

  const minVal = Math.min(...displayData.map((d) => d.val), selectedMetric.normalRange?.min || 50);
  const maxVal = Math.max(...displayData.map((d) => d.val), selectedMetric.normalRange?.max || 120);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 font-sans">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Multi-Metric Vitals Analytics</h3>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center space-x-1.5 bg-accent/50 p-1 rounded-xl border border-border/60">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
          {DATE_RANGE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setDateRange(value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                dateRange === value ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 custom-scrollbar">
        {Object.keys(VITAL_METRICS).map((key) => {
          const m = VITAL_METRICS[key];
          const isSelected = activeMetricKey === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMetricKey(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                  : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Main Bar/Line Chart Canvas */}
      <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono font-semibold text-muted-foreground">
          <span>{selectedMetric.label} ({selectedMetric.unit})</span>
          <span>{displayData.length} Readings</span>
        </div>

        <div className="h-52 flex items-end justify-between gap-2 pt-4 px-2">
          {displayData.map((pt, idx) => {
            const range = maxVal - minVal || 1;
            const percentage = Math.min(100, Math.max(15, ((pt.val - minVal) / range) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {pt.val}
                </div>
                <div
                  style={{ height: `${percentage}%`, backgroundColor: selectedMetric.hex }}
                  className="w-full max-w-[32px] rounded-t-lg transition-all duration-300 opacity-85 group-hover:opacity-100 shadow-xs"
                />
                <span className="text-[10px] font-mono text-muted-foreground truncate">{pt.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VitalTrendChart;
