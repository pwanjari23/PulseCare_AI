/**
 * PulseCare AI - Reports & Analytics Feature Index Module
 */

// Pages
export { ReportsDashboard } from './pages/ReportsDashboard';
export { UserReports } from './pages/UserReports';
export { AppointmentReports } from './pages/AppointmentReports';
export { DoctorReports } from './pages/DoctorReports';
export { PatientReports } from './pages/PatientReports';
export { PrescriptionReports } from './pages/PrescriptionReports';
export { HealthSummaryReports } from './pages/HealthSummaryReports';
export { ActivityReports } from './pages/ActivityReports';

// Components
export { ReportHeader } from './components/ReportHeader';
export { KpiCards } from './components/KpiCards';
export { MetricCard } from './components/MetricCard';
export { TrendCard } from './components/TrendCard';
export { ReportFilters } from './components/ReportFilters';
export { DateRangePicker } from './components/DateRangePicker';
export { AnalyticsCharts } from './components/AnalyticsCharts';
export { LineChartCard } from './components/LineChartCard';
export { BarChartCard } from './components/BarChartCard';
export { PieChartCard } from './components/PieChartCard';
export { AreaChartCard } from './components/AreaChartCard';
export { ActivityTimeline } from './components/ActivityTimeline';
export { RecentReports } from './components/RecentReports';
export { ExportReportDialog } from './components/ExportReportDialog';
export { ReportTable } from './components/ReportTable';
export { ReportPagination } from './components/ReportPagination';
export { ReportSearchBar } from './components/ReportSearchBar';
export { ReportSkeleton } from './components/ReportSkeleton';
export { ReportEmptyState } from './components/ReportEmptyState';

// API & Hooks
export { reportsApi } from './api/reports.api';
export { useReportsOverview } from './hooks/useReportsOverview';
export { useUserReports } from './hooks/useUserReports';
export { useAppointmentReports } from './hooks/useAppointmentReports';
export { useDoctorReports } from './hooks/useUserReports';
export { usePatientReports } from './hooks/useUserReports';
export { useHealthSummaryReports } from './hooks/useHealthSummaryReports';
export { usePrescriptionReports } from './hooks/usePrescriptionReports';
export { useActivityReports } from './hooks/useActivityReports';
export { useExportReports } from './hooks/useExportReports';

// Constants & Utils
export { REPORT_TYPES, REPORT_CONFIG, DATE_RANGE_OPTIONS, EXPORT_FORMATS } from './constants/report.constants';
export { formatNumber, formatCurrency, formatDate, calculateTrend, exportToCSV, exportToPDF, generateReportChartData } from './utils/report.utils';
