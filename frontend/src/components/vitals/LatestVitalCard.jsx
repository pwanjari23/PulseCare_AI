import React from 'react';
import { Clock, Activity, Heart, Thermometer, Zap, Scale } from 'lucide-react';
import VitalStatusBadge from './VitalStatusBadge';

export const LatestVitalCard = ({ vital }) => {
  if (!vital) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-6 text-center space-y-2">
        <Activity className="w-8 h-8 text-muted-foreground mx-auto" />
        <h3 className="text-sm font-bold text-foreground">No Vitals Logged Yet</h3>
        <p className="text-xs text-muted-foreground">Record your daily health telemetry to start monitoring your vitals.</p>
      </div>
    );
  }

  const recordedTime = vital.recordedAt || vital.createdAt
    ? new Date(vital.recordedAt || vital.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent';

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Latest Measurement</span>
          <h3 className="text-base font-bold text-foreground font-display">Vitals Telemetry</h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{recordedTime}</span>
          </span>
          <VitalStatusBadge status={vital.status} alertGenerated={vital.alertGenerated} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Heart className="w-3 h-3 text-rose-500" />
            <span>Heart Rate</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.heartRate} <span className="text-xs font-normal text-muted-foreground">BPM</span></p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Zap className="w-3 h-3 text-healing-500" />
            <span>SpO2</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.spo2}%</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Activity className="w-3 h-3 text-primary" />
            <span>Blood Pressure</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.systolicBp}/{vital.diastolicBp}</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Thermometer className="w-3 h-3 text-amber-500" />
            <span>Temp</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.temperature} <span className="text-xs font-normal text-muted-foreground">°C</span></p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Scale className="w-3 h-3 text-indigo-500" />
            <span>Glucose</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.glucose || '100'} <span className="text-xs font-normal text-muted-foreground">mg/dL</span></p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Scale className="w-3 h-3 text-emerald-500" />
            <span>BMI</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{vital.bmi || '22.5'}</p>
        </div>
      </div>
    </div>
  );
};

export default LatestVitalCard;
