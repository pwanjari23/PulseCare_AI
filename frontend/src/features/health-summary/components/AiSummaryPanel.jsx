/**
 * PulseCare AI - AiSummaryPanel Component
 */

import React from 'react';
import HealthSummaryCard from './HealthSummaryCard';
import HealthInsights from './HealthInsights';

export const AiSummaryPanel = ({
  summaryData,
  onRefresh,
  onGenerateClick,
  canGenerate = false,
  isRefreshing = false,
  className = '',
}) => {
  return (
    <div className={`space-y-6 font-sans ${className}`}>
      <HealthSummaryCard
        summaryData={summaryData}
        onRefresh={onRefresh}
        onGenerateClick={onGenerateClick}
        canGenerate={canGenerate}
        isRefreshing={isRefreshing}
      />
      <HealthInsights summaryData={summaryData} />
    </div>
  );
};

export default AiSummaryPanel;
