/**
 * PulseCare AI - AdminDashboard Page
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { useSystemHealth } from '../hooks/useSystemHealth';
import DashboardHeader from '../components/DashboardHeader';
import DashboardFilters from '../components/DashboardFilters';
import StatisticsCards from '../components/StatisticsCards';
import AnalyticsOverview from '../components/AnalyticsOverview';
import QuickActions from '../components/QuickActions';
import DashboardCharts from '../components/DashboardCharts';
import SystemHealthCard from '../components/SystemHealthCard';
import RecentActivity from '../components/RecentActivity';
import UserStatistics from '../components/UserStatistics';
import AppointmentStatistics from '../components/AppointmentStatistics';
import RevenueOverview from '../components/RevenueOverview';
import DoctorPerformance from '../components/DoctorPerformance';
import PatientStatistics from '../components/PatientStatistics';
import HealthSummaryStatistics from '../components/HealthSummaryStatistics';
import NotificationStatistics from '../components/NotificationStatistics';
import UploadsStatistics from '../components/UploadsStatistics';
import TopDoctorsTable from '../components/TopDoctorsTable';
import TopPatientsTable from '../components/TopPatientsTable';
import UpcomingAppointments from '../components/UpcomingAppointments';
import DashboardSkeleton from '../components/DashboardSkeleton';
import DashboardEmptyState from '../components/DashboardEmptyState';

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [department, setDepartment] = useState('ALL');

  // React Query hooks
  const { data: dashboardData, isLoading, isError, refetch, isFetching } = useDashboard();
  const { data: activityData } = useRecentActivity();
  const { data: systemHealthData } = useSystemHealth();

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateRange('30d');
    setDepartment('ALL');
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <DashboardEmptyState
          title="Error Loading Admin Command Center"
          description="Could not connect to backend server. Please verify system connectivity."
          onRefresh={() => refetch()}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans"
    >
      {/* Top Header */}
      <DashboardHeader
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Global Filter Bar */}
      <DashboardFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        department={department}
        onDepartmentChange={setDepartment}
        onReset={handleResetFilters}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Key Performance Metric Cards */}
      <StatisticsCards data={dashboardData} />

      {/* Quick Action Shortcuts */}
      <QuickActions />

      {/* Analytical & Demographic Overview */}
      <AnalyticsOverview data={dashboardData} />

      {/* Interactive Recharts Analytics */}
      <DashboardCharts />

      {/* Grid: System Health & Real-Time Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard healthData={systemHealthData || dashboardData?.systemStats} />
        <RecentActivity activities={activityData} />
      </div>

      {/* Domain Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserStatistics data={dashboardData} />
        <AppointmentStatistics data={dashboardData} />
        <DoctorPerformance data={dashboardData} />
        <PatientStatistics data={dashboardData} />
        <HealthSummaryStatistics data={dashboardData} />
        <NotificationStatistics data={dashboardData} />
        <RevenueOverview />
        <UploadsStatistics />
      </div>

      {/* Tables & Upcoming Schedules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopDoctorsTable />
        <TopPatientsTable />
      </div>

      <UpcomingAppointments />
    </motion.div>
  );
};

export default AdminDashboard;
