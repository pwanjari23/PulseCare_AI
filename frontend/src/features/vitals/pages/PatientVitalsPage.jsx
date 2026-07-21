import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, BarChart2, ShieldCheck } from 'lucide-react';
import { useVitals } from '../hooks/useVitals';
import VitalMetricCard from '../components/VitalMetricCard';
import VitalTimeline from '../components/VitalTimeline';
import VitalTrendChart from '../components/VitalTrendChart';
import VitalReferenceRange from '../components/VitalReferenceRange';
import VitalSkeleton from '../components/VitalSkeleton';
import VitalEmptyState from '../components/VitalEmptyState';
import VitalComparison from '../components/VitalComparison';
import { formatBP } from '../utils/vital.utils';

export const PatientVitalsPage = () => {
  const { data: records = [], isLoading, error, refetch } = useVitals();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'trends' | 'timeline' | 'reference'

  const latest = records[0] || null;
  const previous = records[1] || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Activity className="w-7 h-7 text-primary" />
            <span>My Health Vitals</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Personal health metrics, historical trends, and reference guidelines.
          </p>
        </motion.div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-2xl border border-border/60 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'trends' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'timeline' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reference' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Reference Ranges
          </button>
        </div>
      </div>

      {isLoading ? (
        <VitalSkeleton count={3} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load vitals history</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : records.length === 0 ? (
        <VitalEmptyState
          title="No Health Readings Found"
          description="Your doctor has not logged any vital signs yet. Complete a consultation to receive your baseline."
        />
      ) : (
        <>
          {/* Latest Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <VitalMetricCard
              title="Blood Pressure"
              value={latest ? formatBP(latest.systolicBp, latest.diastolicBp) : '--'}
              icon={Activity}
              metricKey="SYSTOLIC_BP"
            />
            <VitalMetricCard
              title="Heart Rate"
              value={latest?.heartRate}
              unit="BPM"
              icon={Activity}
              metricKey="HEART_RATE"
            />
            <VitalMetricCard
              title="SpO₂ Saturation"
              value={latest?.oxygenLevel}
              unit="%"
              icon={Activity}
              metricKey="OXYGEN_LEVEL"
            />
            <VitalMetricCard
              title="Temperature"
              value={latest?.temperature}
              unit="°F"
              icon={Activity}
              metricKey="TEMPERATURE"
            />
          </div>

          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <VitalComparison current={latest} baseline={previous} />
              <VitalTrendChart records={records} />
            </div>
          )}

          {activeTab === 'trends' && (
            <VitalTrendChart records={records} />
          )}

          {activeTab === 'timeline' && (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <VitalTimeline records={records} />
            </div>
          )}

          {activeTab === 'reference' && (
            <VitalReferenceRange />
          )}
        </>
      )}
    </div>
  );
};

export default PatientVitalsPage;
