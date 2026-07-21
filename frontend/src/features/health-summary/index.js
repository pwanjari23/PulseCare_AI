/**
 * PulseCare AI - AI Health Summary Feature Index Module
 */

// Pages
export { HealthSummaryDashboard } from './pages/HealthSummaryDashboard';
export { PatientHealthSummary } from './pages/PatientHealthSummary';
export { HealthSummaryHistory } from './pages/HealthSummaryHistory';

// Components
export { HealthSummaryCard } from './components/HealthSummaryCard';
export { HealthRiskCard } from './components/HealthRiskCard';
export { VitalsOverview } from './components/VitalsOverview';
export { RecommendationCard } from './components/RecommendationCard';
export { RiskScore } from './components/RiskScore';
export { TrendChart } from './components/TrendChart';
export { VitalsChart } from './components/VitalsChart';
export { HealthTimeline } from './components/HealthTimeline';
export { HealthInsights } from './components/HealthInsights';
export { AiSummaryPanel } from './components/AiSummaryPanel';
export { SummaryStatusBadge } from './components/SummaryStatusBadge';
export { HealthSummaryFilters } from './components/HealthSummaryFilters';
export { HealthSummarySearch } from './components/HealthSummarySearch';
export { HealthSummarySkeleton } from './components/HealthSummarySkeleton';
export { HealthSummaryEmptyState } from './components/HealthSummaryEmptyState';
export { GenerateSummaryDialog } from './components/GenerateSummaryDialog';

// API & Hooks
export { healthSummaryApi } from './api/healthSummary.api';
export { useHealthSummary } from './hooks/useHealthSummary';
export { usePatientSummary } from './hooks/usePatientSummary';
export { useGenerateSummary } from './hooks/useGenerateSummary';
export { useSummaryHistory } from './hooks/useSummaryHistory';

// Constants & Utils
export {
  RISK_LEVELS,
  RISK_CONFIG,
  AI_DISCLAIMER,
  TIMELINE_EVENT_TYPES,
  TIMELINE_EVENT_CONFIG,
  RECOMMENDATION_PRIORITIES,
  RECOMMENDATION_CONFIG,
  DATE_RANGE_OPTIONS,
  VITAL_METRIC_CONFIG,
} from './constants/healthSummary.constants';

export {
  calculateOverallScore,
  formatDate,
  formatTimeAgo,
  evaluateVitalStatus,
  extractTimelineEvents,
} from './utils/healthSummary.utils';
