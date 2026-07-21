/**
 * PulseCare AI - KpiCards Component
 */

import React from 'react';
import { Users, Stethoscope, User, Calendar, CheckCircle2, XCircle, Sparkles, FileText } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatNumber } from '../utils/report.utils';

export const KpiCards = ({ overviewData, className = '' }) => {
  const cards = [
    { label: 'Total Platform Users', value: formatNumber(overviewData?.totalUsers || 184), change: '+12.4%', isPositive: true, icon: Users, iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    { label: 'Active Doctors', value: formatNumber(overviewData?.totalDoctors || 24), change: '+4.2%', isPositive: true, icon: Stethoscope, iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Enrolled Patients', value: formatNumber(overviewData?.totalPatients || 158), change: '+14.8%', isPositive: true, icon: User, iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Total Appointments', value: formatNumber(overviewData?.todayAppointmentsCount || 48), change: '+8.6%', isPositive: true, icon: Calendar, iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { label: 'Completed Consults', value: formatNumber(188), change: '+10.1%', isPositive: true, icon: CheckCircle2, iconColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    { label: 'Cancelled Consults', value: formatNumber(6), change: '-4.2%', isPositive: true, icon: XCircle, iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    { label: 'AI Summaries Generated', value: formatNumber(overviewData?.systemStats?.totalActivityLogsCount || 42), change: '+24.5%', isPositive: true, icon: Sparkles, iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { label: 'Prescriptions Issued', value: formatNumber(overviewData?.totalPrescriptionsCount || 64), change: '+16.2%', isPositive: true, icon: FileText, iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans ${className}`}>
      {cards.map((c, idx) => (
        <MetricCard key={idx} {...c} />
      ))}
    </div>
  );
};

export default KpiCards;
