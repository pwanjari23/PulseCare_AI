import React, { useState } from 'react';
import { Activity, Calendar, Heart, Zap, Thermometer } from 'lucide-react';

export const VitalCharts = ({ vitals = [] }) => {
  const [range, setRange] = useState('7'); // '7' | '30' | '90'
  const [activeMetric, setActiveMetric] = useState('heartRate'); // 'heartRate' | 'bp' | 'spo2' | 'temperature'

  const metrics = [
    { id: 'heartRate', label: 'Heart Rate', unit: 'BPM', icon: Heart, color: '#f43f5e' },
    { id: 'bp', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: '#0284c7' },
    { id: 'spo2', label: 'SpO2 Saturation', unit: '%', icon: Zap, color: '#0d9488' },
    { id: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, color: '#d97706' },
  ];

  // Dummy mock plot data points for visualization fallback if vitals array is small
  const samplePoints = [
    { label: 'Mon', heartRate: 72, systolicBp: 120, diastolicBp: 80, spo2: 98, temperature: 36.8 },
    { label: 'Tue', heartRate: 75, systolicBp: 122, diastolicBp: 82, spo2: 97, temperature: 37.0 },
    { label: 'Wed', heartRate: 70, systolicBp: 118, diastolicBp: 78, spo2: 99, temperature: 36.7 },
    { label: 'Thu', heartRate: 82, systolicBp: 128, diastolicBp: 84, spo2: 96, temperature: 37.2 },
    { label: 'Fri', heartRate: 74, systolicBp: 121, diastolicBp: 81, spo2: 98, temperature: 36.9 },
    { label: 'Sat', heartRate: 71, systolicBp: 119, diastolicBp: 79, spo2: 98, temperature: 36.8 },
    { label: 'Sun', heartRate: 73, systolicBp: 120, diastolicBp: 80, spo2: 98, temperature: 36.8 },
  ];

  const activeMetricObj = metrics.find((m) => m.id === activeMetric) || metrics[0];

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Vitals Trend Analysis</h3>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1.5 bg-accent/50 p-1 rounded-xl border border-border/60">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
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
        {metrics.map((m) => {
          const Icon = m.icon;
          const isSelected = activeMetric === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
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

      {/* SVG Chart Visualization */}
      <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono font-semibold text-muted-foreground">
          <span>{activeMetricObj.label} ({activeMetricObj.unit})</span>
          <span>{range} Days History</span>
        </div>

        {/* Dynamic SVG Bar / Line Representation */}
        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
          {samplePoints.map((pt, idx) => {
            const val = activeMetric === 'bp' ? pt.systolicBp : pt[activeMetric] || 70;
            // Normalize height for bar representation
            const minVal = activeMetric === 'temperature' ? 35 : activeMetric === 'spo2' ? 90 : 50;
            const maxVal = activeMetric === 'temperature' ? 40 : activeMetric === 'spo2' ? 100 : 150;
            const percentage = Math.min(100, Math.max(20, ((val - minVal) / (maxVal - minVal)) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
                <div
                  style={{ height: `${percentage}%`, backgroundColor: activeMetricObj.color }}
                  className="w-full max-w-[28px] rounded-t-lg transition-all duration-500 opacity-80 group-hover:opacity-100 shadow-xs"
                />
                <span className="text-[10px] font-mono text-muted-foreground">{pt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VitalCharts;
