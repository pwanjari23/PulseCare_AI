/**
 * PulseCare AI - Admin Dashboard Feature Index Module
 */

// Pages
export { AdminDashboard } from './pages/AdminDashboard';

// Components
export { DashboardHeader } from './components/DashboardHeader';
export { StatisticsCards } from './components/StatisticsCards';
export { AnalyticsOverview } from './components/AnalyticsOverview';
export { QuickActions } from './components/QuickActions';
export { RecentActivity } from './components/RecentActivity';
export { SystemHealthCard } from './components/SystemHealthCard';
export { UserStatistics } from './components/UserStatistics';
export { AppointmentStatistics } from './components/AppointmentStatistics';
export { RevenueOverview } from './components/RevenueOverview';
export { DoctorPerformance } from './components/DoctorPerformance';
export { PatientStatistics } from './components/PatientStatistics';
export { HealthSummaryStatistics } from './components/HealthSummaryStatistics';
export { NotificationStatistics } from './components/NotificationStatistics';
export { UploadsStatistics } from './components/UploadsStatistics';
export { TopDoctorsTable } from './components/TopDoctorsTable';
export { TopPatientsTable } from './components/TopPatientsTable';
export { UpcomingAppointments } from './components/UpcomingAppointments';
export { DashboardCharts } from './components/DashboardCharts';
export { DashboardFilters } from './components/DashboardFilters';
export { DashboardSkeleton } from './components/DashboardSkeleton';
export { DashboardEmptyState } from './components/DashboardEmptyState';

// API & Hooks
export { dashboardApi } from './api/dashboard.api';
export { useDashboard } from './hooks/useDashboard';
export { useDashboardStatistics } from './hooks/useDashboardStatistics';
export { useDashboardCharts } from './hooks/useDashboardCharts';
export { useRecentActivity } from './hooks/useRecentActivity';
export { useSystemHealth } from './hooks/useSystemHealth';

// Constants & Utils
export {
  DATE_RANGES,
  SYSTEM_HEALTH_STATUS,
  SYSTEM_HEALTH_CONFIG,
  ACTIVITY_TYPES,
  ACTIVITY_CONFIG,
  QUICK_ACTIONS,
} from './constants/dashboard.constants';

export {
  formatNumber,
  formatUptime,
  formatMemoryUsage,
  calculatePercentageChange,
  generateAdminChartData,
} from './utils/dashboard.utils';
