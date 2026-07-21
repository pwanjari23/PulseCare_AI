/**
 * PulseCare AI - TrendChart Component using Recharts
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { DATE_RANGE_OPTIONS } from '../constants/healthSummary.constants';

const METRIC_OPTIONS = [
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg', color: '#0284c7' },
  { key: 'heartRate', label: 'Heart Rate', unit: 'BPM', color: '#f43f5e' },
  { key: 'glucose', label: 'Blood Sugar', unit: 'mg/dL', color: '#8b5cf6' },
  { key: 'spo2', label: 'Oxygen (SpO₂)', unit: '%', color: '#14b8a6' },
  { key: 'temp', label: 'Temperature', unit: '°F', color: '#f59e0b' },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', color: '#ec4899' },
];

export const TrendChart = ({ records = [], className = '' }) => {
  const [activeMetric, setActiveMetric] = useState('bp');
  const [selectedRange, setSelectedRange] = useState('30d');

  // Format data for chart
  const chartData = useMemo(() => {
    // Generate base demo/real chart history points if empty
    let sourceRecords = records;
    if (!sourceRecords || sourceRecords.length === 0) {
      sourceRecords = [
        { loggedAt: new Date(Date.now() - 28 * 86400000), systolicBp: 118, diastolicBp: 76, heartRate: 72, bloodGlucoseMgdl: 95, oxygenLevel: 98, temperature: 98.4, weight: 70 },
        { loggedAt: new Date(Date.now() - 21 * 86400000), systolicBp: 122, diastolicBp: 80, heartRate: 75, bloodGlucoseMgdl: 102, oxygenLevel: 97, temperature: 98.6, weight: 70.2 },
        { loggedAt: new Date(Date.now() - 14 * 86400000), systolicBp: 120, diastolicBp: 78, heartRate: 71, bloodGlucoseMgdl: 98, oxygenLevel: 98, temperature: 98.2, weight: 69.8 },
        { loggedAt: new Date(Date.now() - 7 * 86400000), systolicBp: 125, diastolicBp: 82, heartRate: 78, bloodGlucoseMgdl: 110, oxygenLevel: 99, temperature: 98.7, weight: 70.5 },
        { loggedAt: new Date(), systolicBp: 119, diastolicBp: 77, heartRate: 70, bloodGlucoseMgdl: 94, oxygenLevel: 98, temperature: 98.4, weight: 70.1 },
      ];
    }

    return sourceRecords.map((r, i) => {
      const dateStr = r.loggedAt ? new Date(r.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Day ${i + 1}`;
      const height = r.patient?.heightCm || 175;
      const weight = r.weight || 70;
      const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));

      return {
        date: dateStr,
        systolic: r.systolicBp || 120,
        diastolic: r.diastolicBp || 80,
        heartRate: r.heartRate || 72,
        glucose: r.bloodGlucoseMgdl || 95,
        spo2: r.oxygenLevel || 98,
        temp: r.temperature || 98.6,
        bmi: bmi || 22.5,
        weight: weight,
      };
    });
  }, [records]);

  const currentMetricConfig = METRIC_OPTIONS.find((m) => m.key === activeMetric) || METRIC_OPTIONS[0];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Physiological Trend Charts</h3>
            <p className="text-xs text-muted-foreground">Historical telemetry analytics over time</p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 bg-accent/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {DATE_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedRange(opt.value)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRange === opt.value
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {METRIC_OPTIONS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 border ${
              activeMetric === m.key
                ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                : 'bg-accent/30 hover:bg-accent text-muted-foreground hover:text-foreground border-border/40'
            }`}
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetricConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentMetricConfig.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
            <YAxis tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                borderRadius: '1rem',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            {activeMetric === 'bp' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP (mmHg)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic BP (mmHg)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#diastolicGradient)"
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={activeMetric}
                name={`${currentMetricConfig.label} (${currentMetricConfig.unit})`}
                stroke={currentMetricConfig.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#metricGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
