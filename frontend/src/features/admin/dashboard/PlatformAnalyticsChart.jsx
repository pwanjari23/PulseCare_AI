import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, Users, Stethoscope, Calendar, HeartPulse } from 'lucide-react';
import { ADMIN_ANALYTICS_METRICS } from './dashboard.constants';

export const PlatformAnalyticsChart = () => {
  const [activeMetric, setActiveMetric] = useState('userGrowth');
  const [range, setRange] = useState('30'); // '7' | '30' | '90' | '365'

  const plotData = [
    { label: 'Jan', userGrowth: 120, doctorGrowth: 25, appointments: 80, vitals: 300 },
    { label: 'Feb', userGrowth: 140, doctorGrowth: 28, appointments: 95, vitals: 360 },
    { label: 'Mar', userGrowth: 160, doctorGrowth: 32, appointments: 110, vitals: 420 },
    { label: 'Apr', userGrowth: 184, doctorGrowth: 38, appointments: 142, vitals: 510 },
  ];

  const activeMetricObj = ADMIN_ANALYTICS_METRICS.find((m) => m.id === activeMetric) || ADMIN_ANALYTICS_METRICS[0];

  const getMetricIcon = (id) => {
    if (id === 'userGrowth') return Users;
    if (id === 'doctorGrowth') return Stethoscope;
    if (id === 'appointments') return Calendar;
    return HeartPulse;
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div>
          <h3 className="text-base font-bold text-foreground font-display">Platform Telemetry Analytics</h3>
          <p className="text-xs text-muted-foreground">Comprehensive platform usage, registrations, and consultation volume</p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-xl border border-border/60">
          {[
            { value: '7', label: '7D' },
            { value: '30', label: '30D' },
            { value: '90', label: '90D' },
            { value: '365', label: '1Y' },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                range === r.value ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 custom-scrollbar">
        {ADMIN_ANALYTICS_METRICS.map((m) => {
          const Icon = getMetricIcon(m.id);
          const isSelected = activeMetric === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary font-bold shadow-2xs'
                  : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plotData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="adminMetricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeMetricObj.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeMetricObj.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="rgba(150, 150, 150, 0.6)" />
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
              fill="url(#adminMetricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlatformAnalyticsChart;
