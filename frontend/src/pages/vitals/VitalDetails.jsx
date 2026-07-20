import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, Activity, Thermometer, Zap, Scale, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { VitalStatusBadge, AlertBanner, DeleteVitalDialog } from '../../components/vitals';

export const VitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPatient = user?.role?.toLowerCase() === 'patient';
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Mock detail fallback for single vital record
  const vital = {
    id: id || 1,
    heartRate: 72,
    spo2: 98,
    systolicBp: 120,
    diastolicBp: 80,
    temperature: 36.8,
    glucose: 100,
    weightKg: 70.5,
    heightCm: 175.0,
    bmi: 23.0,
    bmiCategory: 'Normal weight',
    status: 'Normal',
    alertGenerated: false,
    recordedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const recordedTime = vital.recordedAt
    ? new Date(vital.recordedAt).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/vitals')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vitals</span>
        </button>

        <VitalStatusBadge status={vital.status} alertGenerated={vital.alertGenerated} />
      </div>

      {/* Backend Alert Banner if triggered */}
      <AlertBanner vital={vital} />

      {/* Details Box */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
              TELEMETRY RECORD #{vital.id}
            </span>
            <h2 className="text-xl font-bold text-foreground font-display">Physiological Measurement</h2>
            <span className="text-xs text-muted-foreground flex items-center space-x-1 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{recordedTime}</span>
            </span>
          </div>

          {isPatient && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/vitals/new?edit=${vital.id}`)}
                className="p-2 rounded-xl bg-accent hover:bg-accent/80 text-foreground transition-colors text-xs font-semibold flex items-center space-x-1"
                title="Edit Record"
              >
                <Edit className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors text-xs font-semibold flex items-center space-x-1"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Vital Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Heart Rate</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.heartRate} <span className="text-xs font-normal text-muted-foreground">BPM</span></p>
            <span className="text-[10px] text-muted-foreground block">Reference: 60 - 100 BPM</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Zap className="w-4 h-4 text-healing-500" />
              <span>SpO2 Saturation</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.spo2}%</p>
            <span className="text-[10px] text-muted-foreground block">Reference: 95 - 100%</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Activity className="w-4 h-4 text-primary" />
              <span>Blood Pressure</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.systolicBp}/{vital.diastolicBp}</p>
            <span className="text-[10px] text-muted-foreground block">Reference: 120/80 mmHg</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>Body Temp</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.temperature} <span className="text-xs font-normal text-muted-foreground">°C</span></p>
            <span className="text-[10px] text-muted-foreground block">Reference: 36.5 - 37.5 °C</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Scale className="w-4 h-4 text-indigo-500" />
              <span>Blood Glucose</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.glucose || '100'} <span className="text-xs font-normal text-muted-foreground">mg/dL</span></p>
            <span className="text-[10px] text-muted-foreground block">Fasting target: &lt;100 mg/dL</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Scale className="w-4 h-4 text-emerald-500" />
              <span>BMI Score</span>
            </div>
            <p className="text-xl font-extrabold text-foreground font-display">{vital.bmi || '23.0'}</p>
            <span className="text-[10px] font-bold text-emerald-500 block">{vital.bmiCategory || 'Normal weight'}</span>
          </div>
        </div>
      </div>

      <DeleteVitalDialog
        vital={vital}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};

export default VitalDetails;
