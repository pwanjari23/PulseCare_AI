import React from 'react';
import { Users, Stethoscope, HeartPulse, Calendar, UserCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlatformStatistics = ({ data }) => {
  const stats = [
    { title: 'Total Registered Users', value: data?.totalUsers || 184, subtext: '+12% this month', icon: Users, color: 'primary' },
    { title: 'Certified Doctors', value: data?.totalDoctors || 38, subtext: 'Verified practitioners', icon: Stethoscope, color: 'healing' },
    { title: 'Active Patients', value: data?.totalPatients || 142, subtext: 'Active EHR profiles', icon: HeartPulse, color: 'indigo' },
    { title: 'Appointments Today', value: data?.todayAppointmentsCount || 16, subtext: 'Scheduled consultations', icon: Calendar, color: 'amber' },
    { title: 'Pending Doctor Approvals', value: data?.pendingDoctorApprovalsCount || 4, subtext: 'Awaiting credential check', icon: UserCheck, color: 'emerald' },
    { title: 'Critical Telemetry Alerts', value: data?.openAlertsCount || 3, subtext: 'Open clinical flags', icon: ShieldAlert, color: 'rose' },
  ];

  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    healing: 'bg-healing-500/10 text-healing-600 dark:text-healing-400 border-healing-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        const badgeClass = colorMap[s.color] || colorMap.primary;

        return (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border/60 hover:border-border/90 rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground truncate">{s.title}</span>
              <div className={`p-1.5 rounded-xl border ${badgeClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-foreground font-display tracking-tight">{s.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{s.subtext}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PlatformStatistics;
