import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, RefreshCw } from 'lucide-react';
import { useVitals } from '../hooks/useVitals';
import VitalTrendChart from '../components/VitalTrendChart';
import VitalChart from '../components/VitalChart';
import VitalSkeleton from '../components/VitalSkeleton';
import VitalEmptyState from '../components/VitalEmptyState';

export const VitalAnalyticsPage = () => {
  const { data: records = [], isLoading, error, refetch } = useVitals();

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/vitals"
            className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span>Vitals Analytics & Clinical Trends</span>
            </h1>
            <p className="text-xs text-muted-foreground">Comprehensive longitudinal physiological trend analysis.</p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-xl hover:bg-accent transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <VitalSkeleton count={3} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load analytics</p>
          <p>{error.message}</p>
        </div>
      ) : records.length === 0 ? (
        <VitalEmptyState
          title="No Analytics Data Available"
          description="Log physiological measurements to view historical trend charts and clinical analytics."
        />
      ) : (
        <>
          {/* Main trend chart */}
          <VitalTrendChart records={records} />

          {/* Grid of individual metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VitalChart metricKey="HEART_RATE" data={records} title="Heart Rate (BPM)" />
            <VitalChart metricKey="SYSTOLIC_BP" data={records} title="Systolic Blood Pressure (mmHg)" />
            <VitalChart metricKey="OXYGEN_LEVEL" data={records} title="SpO₂ Saturation (%)" />
            <VitalChart metricKey="TEMPERATURE" data={records} title="Body Temperature (°F)" />
          </div>
        </>
      )}
    </div>
  );
};

export default VitalAnalyticsPage;
