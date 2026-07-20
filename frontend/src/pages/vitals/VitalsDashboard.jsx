import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, History, Heart, Activity, Thermometer, Zap } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useLatestVital, useVitals } from '../../hooks/useVitals';
import {
  LatestVitalCard,
  BMICard,
  AlertBanner,
  VitalCard,
  VitalCharts,
} from '../../components/vitals';

export const VitalsDashboard = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'patient';
  const isPatient = role === 'patient';

  const { data: latestData, isLoading: isLoadingLatest } = useLatestVital();
  const { data: historyData = [] } = useVitals();

  // Mock latest vital fallback for development preview if API is loading or empty
  const latestVital = latestData || {
    id: 1,
    heartRate: 72,
    spo2: 98,
    systolicBp: 120,
    diastolicBp: 80,
    temperature: 36.8,
    glucose: 100,
    weightKg: 70.5,
    heightCm: 175.0,
    bmi: 23.0,
    status: 'Normal',
    alertGenerated: false,
    recordedAt: new Date().toISOString(),
  };

  const rawVitalsList = Array.isArray(historyData) ? historyData : historyData?.vitals || [];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display">Vitals & Telemetry Log</h2>
          <p className="text-xs text-muted-foreground">Monitor real-time physiological metrics and clinical alert indicators</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/vitals/history"
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-xs font-semibold rounded-xl text-foreground transition-colors flex items-center space-x-1.5"
          >
            <History className="w-4 h-4 text-primary" />
            <span>View Full History</span>
          </Link>

          {isPatient && (
            <Link
              to="/vitals/new"
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Vitals</span>
            </Link>
          )}
        </div>
      </div>

      {/* Backend Clinical Alert Banner (if triggered) */}
      <AlertBanner vital={latestVital} />

      {/* Hero Latest Vital Telemetry */}
      {isLoadingLatest ? (
        <div className="h-44 bg-card border border-border/60 rounded-3xl animate-pulse p-6" />
      ) : (
        <LatestVitalCard vital={latestVital} />
      )}

      {/* Primary Metric Grid & BMI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard
          title="Heart Rate"
          value={latestVital?.heartRate}
          unit="BPM"
          status={latestVital?.heartRate > 100 ? 'Warning' : 'Normal'}
          isAbnormal={latestVital?.heartRate > 100 || latestVital?.heartRate < 50}
          rangeText="Normal: 60 - 100 BPM"
          icon={Heart}
        />
        <VitalCard
          title="Oxygen Saturation"
          value={latestVital?.spo2}
          unit="%"
          status={latestVital?.spo2 < 95 ? 'Low SpO2' : 'Normal'}
          isAbnormal={latestVital?.spo2 < 95}
          rangeText="Normal: 95 - 100%"
          icon={Zap}
        />
        <VitalCard
          title="Blood Pressure"
          value={`${latestVital?.systolicBp || 120}/${latestVital?.diastolicBp || 80}`}
          unit="mmHg"
          status={latestVital?.systolicBp > 140 ? 'Elevated' : 'Normal'}
          isAbnormal={latestVital?.systolicBp > 140 || latestVital?.diastolicBp > 90}
          rangeText="Normal: 120/80 mmHg"
          icon={Activity}
        />
        <VitalCard
          title="Body Temperature"
          value={latestVital?.temperature}
          unit="°C"
          status={latestVital?.temperature > 37.5 ? 'Fever' : 'Normal'}
          isAbnormal={latestVital?.temperature > 37.8 || latestVital?.temperature < 35.5}
          rangeText="Normal: 36.5 - 37.5 °C"
          icon={Thermometer}
        />
      </div>

      {/* BMI Card & Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BMICard bmi={latestVital?.bmi} category={latestVital?.bmiCategory} />
        </div>
        <div className="lg:col-span-2">
          <VitalCharts vitals={rawVitalsList} />
        </div>
      </div>
    </div>
  );
};

export default VitalsDashboard;
