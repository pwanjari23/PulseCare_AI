/**
 * PulseCare AI - PatientHealthSummary Page (Doctor / Admin)
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';
import { usePatientSummary } from '../hooks/usePatientSummary';
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

export const PatientHealthSummary = () => {
  const { patientId } = useParams();
  const { user } = useAuthStore();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const isDoctor = user?.role === ROLES.DOCTOR;

  // Fetch summary for patientId
  const { data: summaryData, isLoading, isError, refetch, isFetching } = usePatientSummary(patientId);

  // Generate mutation
  const generateMutation = useGenerateSummary({
    onSuccess: () => {
      setIsGenerateDialogOpen(false);
    },
  });

  const handleGenerate = (data) => {
    generateMutation.mutate({ ...data, patientId });
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
            <h3 className="text-base font-bold text-foreground font-display">Unable to retrieve patient summary</h3>
            <p className="text-xs text-muted-foreground">Verify clinical relationship or try again.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
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

  const patientName = summaryData?.patient
    ? `Dr. Evaluation for ${summaryData.patient.firstName} ${summaryData.patient.lastName}`
    : `Patient #${patientId} AI Summary`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/patients"
            className="p-2 rounded-2xl bg-card hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs"
            title="Back to Patients"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">{patientName}</h1>
            <p className="text-xs text-muted-foreground">Clinical health summary & physiological risk tiering</p>
          </div>
        </div>

        {isDoctor && (
          <button
            onClick={() => setIsGenerateDialogOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all hover:shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Fresh AI Assessment</span>
          </button>
        )}
      </div>

      {/* Main AI Summary Card */}
      <HealthSummaryCard
        summaryData={summaryData}
        onRefresh={() => refetch()}
        onGenerateClick={() => setIsGenerateDialogOpen(true)}
        canGenerate={isDoctor}
        isRefreshing={isFetching}
      />

      {/* Risk Card & Action Plan */}
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

      {/* Structured Insights */}
      <HealthInsights summaryData={summaryData} />

      {/* Patient Timeline */}
      <HealthTimeline summaryData={summaryData} />

      {/* Dialog */}
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

export default PatientHealthSummary;
