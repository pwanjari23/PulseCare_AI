import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/auth.store';
import { useDoctorDashboard } from './dashboard.query';
import { DashboardErrorState } from '../../../components/dashboard';
import DoctorDashboardHeader from './DoctorDashboardHeader';
import PatientStatisticsCard from './PatientStatisticsCard';
import TodayAppointmentsCard from './TodayAppointmentsCard';
import VitalAlertsCard from './VitalAlertsCard';
import DoctorAnalyticsChart from './DoctorAnalyticsChart';
import RecentPatientsCard from './RecentPatientsCard';
import AvailabilityCard from './AvailabilityCard';
import PrescriptionSummaryCard from './PrescriptionSummaryCard';
import PendingRequestsCard from './PendingRequestsCard';
import QuickActions from './QuickActions';
import DashboardSkeleton from './DashboardSkeleton';
import EmptyDashboard from './EmptyDashboard';

export const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error, refetch } = useDoctorDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        title="Failed to Load Doctor Workspace"
        message={error?.message || 'Unable to connect to clinical telemetry backend.'}
        onRetry={() => refetch()}
      />
    );
  }

  const todayAppointments = data?.todayAppointments || [];
  const vitalAlerts = data?.vitalAlerts || [];
  const recentPatients = data?.recentPatients || [];
  const availability = data?.availability || null;
  const isDataEmpty = todayAppointments.length === 0 && recentPatients.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <DoctorDashboardHeader
        user={user}
        todayAppointmentsCount={todayAppointments.length}
        unreadCount={data?.unreadNotificationsCount || 0}
      />

      {/* Statistics Metric Cards Row */}
      <PatientStatisticsCard data={data} />

      {isDataEmpty ? (
        <EmptyDashboard user={user} />
      ) : (
        <>
          {/* Today's Appointments & Vital Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodayAppointmentsCard appointments={todayAppointments} />
            <VitalAlertsCard alerts={vitalAlerts} />
          </div>

          {/* Clinical Analytics Recharts Graph */}
          <DoctorAnalyticsChart />

          {/* Recent Patients & Availability Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentPatientsCard patients={recentPatients} />
            <AvailabilityCard availability={availability} />
          </div>

          {/* Prescription Summary & Pending Requests Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PrescriptionSummaryCard count={data?.activePrescriptionsCount} />
            <PendingRequestsCard />
          </div>

          {/* Quick Actions Grid */}
          <QuickActions />
        </>
      )}
    </motion.div>
  );
};

export default DoctorDashboard;
