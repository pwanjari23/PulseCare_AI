/**
 * PulseCare AI - AdminDashboard Page
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { useRecentActivity } from '../hooks/useRecentActivity';
import DashboardHeader from '../components/DashboardHeader';
import DashboardFilters from '../components/DashboardFilters';
import StatisticsCards from '../components/StatisticsCards';
import AnalyticsOverview from '../components/AnalyticsOverview';
import QuickActions from '../components/QuickActions';
import DashboardCharts from '../components/DashboardCharts';
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
  const [activeTab, setActiveTab] = useState('overview');

  // React Query hooks
  const { data: dashboardData, isLoading, isError, refetch, isFetching } = useDashboard();
  const { data: activityData } = useRecentActivity();

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
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans"
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

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/60 overflow-x-auto whitespace-nowrap scrollbar-none gap-2 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'metrics'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Detailed Metrics
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'activity'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Platform Activity
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'schedules'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Rosters & Schedules
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Key Performance Metric Cards */}
            <StatisticsCards data={dashboardData} />

            {/* Quick Action Shortcuts */}
            <QuickActions />

            {/* Analytical & Demographic Overview */}
            <AnalyticsOverview data={dashboardData} />

            {/* Interactive Recharts Analytics */}
            <DashboardCharts />
          </motion.div>
        )}

        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <UserStatistics data={dashboardData} />
            <AppointmentStatistics data={dashboardData} />
            <DoctorPerformance data={dashboardData} />
            <PatientStatistics data={dashboardData} />
            <HealthSummaryStatistics data={dashboardData} />
            <NotificationStatistics data={dashboardData} />
            <RevenueOverview />
            <UploadsStatistics />
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Real-Time Activity Log */}
            <RecentActivity activities={activityData} className="w-full" />
          </motion.div>
        )}

        {activeTab === 'schedules' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Tables & Upcoming Schedules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopDoctorsTable doctors={dashboardData?.topDoctors} />
              <TopPatientsTable patients={dashboardData?.topPatients} />
            </div>

            <UpcomingAppointments appointments={dashboardData?.upcomingAppointments} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
