/**
 * PulseCare AI - HealthSummaryDashboard Page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, History, RefreshCw, AlertTriangle, ShieldCheck, HeartPulse, User } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';
import { useHealthSummary } from '../hooks/useHealthSummary';
import { useGenerateSummary } from '../hooks/useGenerateSummary';
import HealthSummaryCard from '../components/HealthSummaryCard';
import HealthRiskCard from '../components/HealthRiskCard';
import VitalsOverview from '../components/VitalsOverview';
import TrendChart from '../components/TrendChart';
import HealthTimeline from '../components/HealthTimeline';
import HealthInsights from '../components/HealthInsights';
import RecommendationCard from '../components/RecommendationCard';
import GenerateSummaryDialog from '../components/GenerateSummaryDialog';
import HealthSummarySkeleton from '../components/HealthSummarySkeleton';
import HealthSummaryEmptyState from '../components/HealthSummaryEmptyState';

export const HealthSummaryDashboard = () => {
  const { user } = useAuthStore();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const isDoctor = user?.role === ROLES.DOCTOR;
  const isPatient = user?.role === ROLES.PATIENT;

  // React Query hook for health summary
  const { data: summaryData, isLoading, isError, refetch, isFetching } = useHealthSummary();

  // React Query mutation hook for generating AI summary
  const generateMutation = useGenerateSummary({
    onSuccess: () => {
      setIsGenerateDialogOpen(false);
    },
  });

  const handleGenerate = (data) => {
    generateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <HealthSummarySkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <div className="bg-card border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto my-12 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground font-display">Unable to load AI Health Summary</h3>
            <p className="text-xs text-muted-foreground">Please check network connection or try refreshing.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!summaryData && !isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <HealthSummaryEmptyState
          canGenerate={isDoctor}
          onGenerate={() => setIsGenerateDialogOpen(true)}
        />
        <GenerateSummaryDialog
          isOpen={isGenerateDialogOpen}
          onClose={() => setIsGenerateDialogOpen(false)}
          onGenerate={handleGenerate}
          isGenerating={generateMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Header Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">AI Health Assessment</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Clinical Intelligence
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time physiological synthesis & advisory patient insights
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/health-summary/history"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-card hover:bg-accent border border-border/60 text-xs font-semibold text-foreground transition-all shadow-2xs"
          >
            <History className="w-4 h-4 text-muted-foreground" />
            <span>Assessment Logs</span>
          </Link>

          {isDoctor && (
            <button
              onClick={() => setIsGenerateDialogOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate New AI Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Main AI Summary Card */}
      <HealthSummaryCard
        summaryData={summaryData}
        onRefresh={() => refetch()}
        onGenerateClick={() => setIsGenerateDialogOpen(true)}
        canGenerate={isDoctor}
        isRefreshing={isFetching}
      />

      {/* Grid: Risk Card & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthRiskCard summaryData={summaryData} />
        <RecommendationCard recommendations={summaryData?.recommendations || []} />
      </div>

      {/* Vitals Telemetry Overview */}
      <VitalsOverview
        vitals={summaryData?.latestVitals}
        patient={summaryData?.patient}
        bmi={summaryData?.latestBMI}
      />

      {/* Telemetry Trend Charts */}
      <TrendChart records={summaryData?.latestVitals ? [summaryData.latestVitals] : []} />

      {/* AI Structured Clinical Insights */}
      <HealthInsights summaryData={summaryData} />

      {/* Patient Clinical Timeline */}
      <HealthTimeline summaryData={summaryData} />

      {/* Modal Dialog */}
      <GenerateSummaryDialog
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onGenerate={handleGenerate}
        isGenerating={generateMutation.isPending}
        patientName={summaryData?.patient ? `${summaryData.patient.firstName} ${summaryData.patient.lastName}` : ''}
      />
    </div>
  );
};

export default HealthSummaryDashboard;
