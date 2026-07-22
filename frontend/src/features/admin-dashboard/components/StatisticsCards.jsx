/**
 * PulseCare AI - StatisticsCards Component
 */

import React from 'react';
import { Users, Stethoscope, User, Calendar, FileText, Sparkles, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNumber, calculatePercentageChange } from '../utils/dashboard.utils';

export const StatisticsCards = ({ data, className = '' }) => {
  const cards = [
    {
      id: 'total-users',
      label: 'Total Platform Users',
      value: data?.totalUsers || 0,
      change: '+12.4%',
      isPositive: true,
      icon: Users,
      iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      barColor: '#0284c7',
    },
    {
      id: 'total-doctors',
      label: 'Verified Doctors',
      value: data?.totalDoctors || 0,
      change: '+4.8%',
      isPositive: true,
      icon: Stethoscope,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: '#10b981',
      subText: `${data?.pendingDoctorApprovals || 0} Pending Approval`,
    },
    {
      id: 'total-patients',
      label: 'Registered Patients',
      value: data?.totalPatients || 0,
      change: '+15.2%',
      isPositive: true,
      icon: User,
      iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      barColor: '#6366f1',
    },
    {
      id: 'appointments',
      label: 'Total Appointments',
      value: data?.todayAppointmentsCount ? `${data.todayAppointmentsCount} Today` : (data?.activeAppointmentsCount || 0),
      change: '+8.6%',
      isPositive: true,
      icon: Calendar,
      iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      barColor: '#a855f7',
      subText: `${data?.activeAppointmentsCount || 0} Active Consultations`,
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions Issued',
      value: data?.totalPrescriptionsCount || 0,
      change: '+18.1%',
      isPositive: true,
      icon: FileText,
      iconColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      barColor: '#14b8a6',
    },
    {
      id: 'ai-summaries',
      label: 'AI Health Summaries',
      value: data?.totalHealthSummariesCount || 0,
      change: '+24.5%',
      isPositive: true,
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      barColor: '#f59e0b',
    },
    {
      id: 'open-alerts',
      label: 'Open Vital Alerts',
      value: data?.openAlertsCount || 0,
      change: '-2.4%',
      isPositive: true, // fewer alerts is good
      icon: AlertTriangle,
      iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      barColor: '#f43f5e',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans ${className}`}>
      {cards.map((card, idx) => {
        const IconComp = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -2 }}
            className="bg-card border border-border/60 rounded-3xl p-5 shadow-xs hover:border-border transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">{card.label}</span>
              <div className={`p-2 rounded-2xl border ${card.iconColor}`}>
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-foreground font-mono tracking-tight">
                  {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                </span>
                <span
                  className={`inline-flex items-center space-x-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                    card.isPositive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  }`}
                >
                  {card.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{card.change}</span>
                </span>
              </div>

              {/* Progress Bar Indicator */}
              <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.barColor }}
                />
              </div>

              {card.subText && (
                <p className="text-[11px] text-muted-foreground mt-2 font-mono truncate">{card.subText}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
