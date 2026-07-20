import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Calendar, Users, FileText, ShieldAlert } from 'lucide-react';
import { DOCTOR_ANALYTICS_METRICS } from './dashboard.constants';

export const DoctorAnalyticsChart = () => {
  const [activeMetric, setActiveMetric] = useState('appointments');
  const [range, setRange] = useState('30'); // '7' | '30' | '90'

  const plotData = [
    { date: 'Week 1', appointments: 18, patients: 14, prescriptions: 12, alerts: 2 },
    { date: 'Week 2', appointments: 24, patients: 20, prescriptions: 18, alerts: 4 },
    { date: 'Week 3', appointments: 22, patients: 18, prescriptions: 15, alerts: 1 },
    { date: 'Week 4', appointments: 28, patients: 24, prescriptions: 22, alerts: 3 },
  ];

  const activeMetricObj = DOCTOR_ANALYTICS_METRICS.find((m) => m.id === activeMetric) || DOCTOR_ANALYTICS_METRICS[0];

  const getMetricIcon = (id) => {
    if (id === 'appointments') return Calendar;
    if (id === 'patients') return Users;
    if (id === 'prescriptions') return FileText;
    return ShieldAlert;
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div>
          <h3 className="text-base font-bold text-foreground font-display">Clinical Activity Analytics</h3>
          <p className="text-xs text-muted-foreground">Consultations, patient volume, and prescription output</p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-xl border border-border/60">
          {['7', '30', '90'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                range === r ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 custom-scrollbar">
        {DOCTOR_ANALYTICS_METRICS.map((m) => {
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
              <linearGradient id="doctorMetricGradient" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#doctorMetricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DoctorAnalyticsChart;
