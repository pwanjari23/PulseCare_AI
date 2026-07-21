/**
 * PulseCare AI - AnalyticsCharts Component
 */

import React from 'react';
import LineChartCard from './LineChartCard';
import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import AreaChartCard from './AreaChartCard';

export const AnalyticsCharts = ({ data = [], className = '' }) => {
  const pieData = [
    { name: 'Completed', value: 72 },
    { name: 'Pending', value: 18 },
    { name: 'Cancelled', value: 10 },
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 font-sans ${className}`}>
      <AreaChartCard title="User Acquisition & Growth Curve" data={data} dataKey="totalUsers" color="#0284c7" />
      <LineChartCard title="Consultation Appointments Volume" data={data} dataKey="appointments" color="#10b981" />
      <BarChartCard title="Prescription Distribution Telemetry" data={data} dataKey="prescriptions" color="#3b82f6" />
      <PieChartCard title="Appointment Status Share" data={pieData} colors={['#10b981', '#f59e0b', '#ef4444']} />
    </div>
  );
};

export default AnalyticsCharts;
