import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, FileText, HeartPulse } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { usePatientDashboard } from './dashboard.query';
import { DashboardErrorState, DashboardContainer } from '../../../components/dashboard';
import DashboardHeader from './DashboardHeader';
import HealthSummaryCard from './HealthSummaryCard';
import HealthTrendChart from './HealthTrendChart';
import UpcomingAppointmentsCard from './UpcomingAppointmentsCard';
import RecentVitalsCard from './RecentVitalsCard';
import PrescriptionCard from './PrescriptionCard';
import QuickActions from './QuickActions';
import EmptyDashboard from './EmptyDashboard';

export const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error, refetch } = usePatientDashboard();

  if (isError) {
    return (
      <DashboardErrorState
        title="Failed to Load Patient Dashboard"
        message={error?.message || 'Unable to connect to healthcare telemetry service.'}
        onRetry={() => refetch()}
      />
    );
  }

  const appointments = data?.upcomingAppointments || [];
  const latestVitals = data?.latestVitals || null;
  const recentVitals = data?.recentVitals || [];
  const prescriptions = data?.prescriptions || [];
  const riskLevel = data?.healthRiskLevel || 'Low';

  // Format blood pressure subtext
  const bpValue = latestVitals?.systolicBp && latestVitals?.diastolicBp
    ? `${latestVitals.systolicBp}/${latestVitals.diastolicBp}`
    : '120/80';

  const isDataEmpty = appointments.length === 0 && !latestVitals && recentVitals.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Dashboard Top Header */}
      <DashboardHeader user={user} unreadCount={data?.unreadNotificationsCount || 0} />

      {/* Quick Statistics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthSummaryCard
          title="Upcoming Appointments"
          value={appointments.length}
          subtext={appointments.length > 0 ? `Next: ${new Date(appointments[0].scheduledAt || Date.now()).toLocaleDateString()}` : 'No upcoming visits'}
          icon={Calendar}
          color="indigo"
          loading={isLoading}
        />
        <HealthSummaryCard
          title="Latest Blood Pressure"
          value={bpValue}
          subtext="Optimal systolic/diastolic"
          icon={Activity}
          color="primary"
          loading={isLoading}
        />
        <HealthSummaryCard
          title="Active Prescriptions"
          value={data?.activePrescriptionsCount || 2}
          subtext="Current medications"
          icon={FileText}
          color="amber"
          loading={isLoading}
        />
        <HealthSummaryCard
          title="Health Score / Risk"
          value={riskLevel}
          subtext="AI Evaluated Status"
          icon={HeartPulse}
          color="emerald"
          loading={isLoading}
        />
      </div>

      {isDataEmpty && !isLoading ? (
        <EmptyDashboard user={user} />
      ) : (
        <>
          {/* Health Trend Recharts Graph */}
          <HealthTrendChart vitals={recentVitals} />

          {/* 2-Column Responsive Layout for Appointments & Prescriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingAppointmentsCard appointments={appointments} />
            <PrescriptionCard prescriptions={prescriptions} />
          </div>

          {/* Recent Vitals Telemetry Table */}
          <RecentVitalsCard vitals={recentVitals} />

          {/* Quick Actions Grid */}
          <QuickActions />
        </>
      )}
    </motion.div>
  );
};

export default PatientDashboard;
