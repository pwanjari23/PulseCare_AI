import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/auth.store';
import { useAdminDashboard } from './dashboard.query';
import { DashboardErrorState } from '../../../components/dashboard';
import AdminDashboardHeader from './AdminDashboardHeader';
import PlatformStatistics from './PlatformStatistics';
import DoctorApprovalCard from './DoctorApprovalCard';
import RecentUsersCard from './RecentUsersCard';
import AppointmentOverviewCard from './AppointmentOverviewCard';
import SystemHealthCard from './SystemHealthCard';
import ActivityLogCard from './ActivityLogCard';
import NotificationSummaryCard from './NotificationSummaryCard';
import PlatformAnalyticsChart from './PlatformAnalyticsChart';
import QuickActions from './QuickActions';
import DashboardSkeleton from './DashboardSkeleton';
import EmptyDashboard from './EmptyDashboard';

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        title="Failed to Load Admin Workspace"
        message={error?.message || 'Unable to connect to administrative telemetry engine.'}
        onRetry={() => refetch()}
      />
    );
  }

  const pendingDoctors = data?.pendingDoctors || [];
  const recentUsers = data?.recentUsers || [];
  const appointmentBreakdown = data?.appointmentBreakdown || null;
  const systemHealth = data?.systemHealth || null;
  const activityLogs = data?.activityLogs || [];

  const isDataEmpty = data?.totalUsers === 0 && pendingDoctors.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <AdminDashboardHeader user={user} unreadCount={data?.totalNotificationsCount || 0} />

      {/* Platform Statistics Metric Grid */}
      <PlatformStatistics data={data} />

      {isDataEmpty ? (
        <EmptyDashboard user={user} />
      ) : (
        <>
          {/* Recharts Analytics Chart */}
          <PlatformAnalyticsChart />

          {/* Pending Doctor Approvals & Appointment Overview Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DoctorApprovalCard pendingDoctors={pendingDoctors} />
            <AppointmentOverviewCard breakdown={appointmentBreakdown} />
          </div>

          {/* Recent Users & Notifications Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentUsersCard recentUsers={recentUsers} />
            <NotificationSummaryCard count={data?.totalNotificationsCount} />
          </div>

          {/* Activity Audit Logs & System Health Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLogCard logs={activityLogs} />
            <SystemHealthCard health={systemHealth} />
          </div>

          {/* Quick Actions Grid */}
          <QuickActions />
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
