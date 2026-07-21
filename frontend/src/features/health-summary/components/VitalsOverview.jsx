/**
 * PulseCare AI - VitalsOverview Component
 */

import React from 'react';
import { Activity, Heart, Thermometer, Zap, Scale, Ruler, Droplets, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { evaluateVitalStatus } from '../utils/healthSummary.utils';

export const VitalsOverview = ({ vitals, patient, bmi: calculatedBMI, className = '' }) => {
  if (!vitals) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-6 text-center text-muted-foreground space-y-2 font-sans">
        <Activity className="w-8 h-8 mx-auto text-muted-foreground/50" />
        <p className="text-sm font-semibold">No recent vitals available</p>
        <p className="text-xs">Record patient vitals to unlock real-time physiological insights.</p>
      </div>
    );
  }

  const bpStatus = evaluateVitalStatus('bloodPressure', vitals.systolicBp, vitals.diastolicBp);
  const hrStatus = evaluateVitalStatus('heartRate', vitals.heartRate);
  const glucoseStatus = evaluateVitalStatus('bloodGlucoseMgdl', vitals.bloodGlucoseMgdl);
  const spo2Status = evaluateVitalStatus('oxygenLevel', vitals.oxygenLevel);
  const tempStatus = evaluateVitalStatus('temperature', vitals.temperature);

  const bmiVal = calculatedBMI || (vitals.weight && patient?.heightCm ? Number((vitals.weight / Math.pow(patient.heightCm / 100, 2)).toFixed(1)) : null);
  const bmiStatus = evaluateVitalStatus('bmi', bmiVal);

  const metrics = [
    {
      key: 'bp',
      label: 'Blood Pressure',
      value: vitals.systolicBp && vitals.diastolicBp ? `${vitals.systolicBp}/${vitals.diastolicBp}` : 'N/A',
      unit: 'mmHg',
      normal: '90-120 / 60-80',
      icon: Activity,
      iconColor: 'text-sky-500 bg-sky-500/10',
      status: bpStatus,
    },
    {
      key: 'hr',
      label: 'Heart Rate',
      value: vitals.heartRate || 'N/A',
      unit: 'BPM',
      normal: '60 - 100',
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-500/10',
      status: hrStatus,
    },
    {
      key: 'spo2',
      label: 'Oxygen (SpO₂)',
      value: vitals.oxygenLevel ? `${vitals.oxygenLevel}` : 'N/A',
      unit: '%',
      normal: '95 - 100',
      icon: Zap,
      iconColor: 'text-teal-500 bg-teal-500/10',
      status: spo2Status,
    },
    {
      key: 'glucose',
      label: 'Blood Glucose',
      value: vitals.bloodGlucoseMgdl || 'N/A',
      unit: 'mg/dL',
      normal: '70 - 140',
      icon: Droplets,
      iconColor: 'text-indigo-500 bg-indigo-500/10',
      status: glucoseStatus,
    },
    {
      key: 'temp',
      label: 'Temperature',
      value: vitals.temperature ? `${vitals.temperature}` : 'N/A',
      unit: '°F',
      normal: '97.0 - 99.0',
      icon: Thermometer,
      iconColor: 'text-amber-500 bg-amber-500/10',
      status: tempStatus,
    },
    {
      key: 'bmi',
      label: 'Body Mass Index',
      value: bmiVal || 'N/A',
      unit: 'kg/m²',
      normal: '18.5 - 24.9',
      icon: Scale,
      iconColor: 'text-purple-500 bg-purple-500/10',
      status: bmiStatus,
    },
    {
      key: 'weight',
      label: 'Body Weight',
      value: vitals.weight || patient?.weightKg || 'N/A',
      unit: 'kg',
      normal: 'Healthy range',
      icon: Scale,
      iconColor: 'text-blue-500 bg-blue-500/10',
      status: { label: 'Recorded', color: 'text-muted-foreground bg-accent/40' },
    },
    {
      key: 'height',
      label: 'Height',
      value: patient?.heightCm || 'N/A',
      unit: 'cm',
      normal: 'Stature',
      icon: Ruler,
      iconColor: 'text-emerald-500 bg-emerald-500/10',
      status: { label: 'Baseline', color: 'text-muted-foreground bg-accent/40' },
    },
  ];

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground font-display">Vitals & Physiological Metrics</h3>
          <p className="text-xs text-muted-foreground">Most recent patient telemetry & status evaluation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs hover:border-border transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${m.iconColor}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{m.label}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.status.color}`}>
                  {m.status.label}
                </span>
              </div>

              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-foreground font-mono">{m.value}</span>
                  <span className="text-xs text-muted-foreground font-mono">{m.unit}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40 mt-2">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Info className="w-3 h-3 text-muted-foreground" />
                    Normal: {m.normal}
                  </span>
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalsOverview;
