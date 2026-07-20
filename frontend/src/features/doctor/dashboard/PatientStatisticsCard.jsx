import React from 'react';
import { Users, UserPlus, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PatientStatisticsCard = ({ data }) => {
  const stats = [
    { title: 'Total Assigned Patients', value: data?.totalAssignedPatients || 24, subtext: 'Active clinical relationship', icon: Users, color: 'primary' },
    { title: 'New Patients This Month', value: data?.newPatientsThisMonth || 6, subtext: '+25% growth rate', icon: UserPlus, color: 'healing' },
    { title: 'Returning Patients', value: data?.returningPatients || 18, subtext: 'Follow-up consultations', icon: RotateCcw, color: 'indigo' },
    { title: 'Completed Consultations', value: data?.completedConsultations || 142, subtext: 'Total logged EHR visits', icon: CheckCircle2, color: 'emerald' },
  ];

  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    healing: 'bg-healing-500/10 text-healing-600 dark:text-healing-400 border-healing-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        const badgeClass = colorMap[s.color] || colorMap.primary;

        return (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border/60 hover:border-border/90 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{s.title}</span>
              <div className={`p-2 rounded-xl border ${badgeClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-foreground font-display tracking-tight">{s.value}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{s.subtext}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PatientStatisticsCard;
