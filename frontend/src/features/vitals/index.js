// Pages
export { VitalRecordsPage } from './pages/VitalRecordsPage';
export { VitalDetailsPage } from './pages/VitalDetailsPage';
export { AddVitalRecordPage } from './pages/AddVitalRecordPage';
export { EditVitalRecordPage } from './pages/EditVitalRecordPage';
export { PatientVitalsPage } from './pages/PatientVitalsPage';
export { VitalAnalyticsPage } from './pages/VitalAnalyticsPage';

// Components
export { VitalCard } from './components/VitalCard';
export { VitalTable } from './components/VitalTable';
export { VitalTimeline } from './components/VitalTimeline';
export { VitalChart } from './components/VitalChart';
export { VitalTrendChart } from './components/VitalTrendChart';
export { VitalMetricCard } from './components/VitalMetricCard';
export { VitalSummary } from './components/VitalSummary';
export { VitalStatusBadge } from './components/VitalStatusBadge';
export { VitalFilters } from './components/VitalFilters';
export { VitalSearchBar } from './components/VitalSearchBar';
export { VitalForm } from './components/VitalForm';
export { VitalHistory } from './components/VitalHistory';
export { VitalComparison } from './components/VitalComparison';
export { VitalReferenceRange } from './components/VitalReferenceRange';
export { VitalEmptyState } from './components/VitalEmptyState';
export { VitalSkeleton } from './components/VitalSkeleton';
export { DeleteVitalDialog } from './components/DeleteVitalDialog';

// Hooks
export { useVitals } from './hooks/useVitals';
export { useVital } from './hooks/useVital';
export { usePatientVitals } from './hooks/usePatientVitals';
export { useCreateVital } from './hooks/useCreateVital';
export { useUpdateVital } from './hooks/useUpdateVital';
export { useDeleteVital } from './hooks/useDeleteVital';

// API, Constants & Utils
export { vitalApi } from './api/vital.api';
export { VITAL_METRICS, TRIAGE_STATUS, TRIAGE_CONFIG, BLOOD_GLUCOSE_TYPES, DATE_RANGE_OPTIONS } from './constants/vital.constants';
export { calculateBMI, getBMICategory, evaluateMetricStatus, evaluateOverallTriage, formatBP, formatLoggedDate, filterVitals } from './utils/vital.utils';
