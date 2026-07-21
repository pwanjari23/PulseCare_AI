/**
 * PulseCare AI - ActivityTimeline Component
 */

import React from 'react';
import { Activity, Clock, ShieldCheck, UserPlus, Calendar, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/report.utils';

const EVENT_ICONS = {
  registration: UserPlus,
  appointment: Calendar,
  prescription: FileText,
  ai_summary: Sparkles,
  default: Activity,
};

export const ActivityTimeline = ({ activities = [], className = '' }) => {
  const list = activities.length > 0 ? activities : [
    { id: 1, action: 'User Registration', description: 'Dr. Elena Rostova registered a new account.', createdAt: '2026-07-21T10:00:00Z', type: 'registration' },
    { id: 2, action: 'AI Health Assessment', description: 'Generated health risk summary for Sarah Connor.', createdAt: '2026-07-21T09:30:00Z', type: 'ai_summary' },
    { id: 3, action: 'Appointment Booked', description: 'John Doe scheduled consultation with Dr. Robert Chen.', createdAt: '2026-07-21T08:15:00Z', type: 'appointment' },
    { id: 4, action: 'Prescription Issued', description: 'Dr. Robert Chen generated Rx #8841.', createdAt: '2026-07-20T16:00:00Z', type: 'prescription' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" /> Real-time System Audit Trail
      </h3>

      <div className="relative border-l border-border/60 ml-3.5 space-y-6 pt-2">
        {list.map((act, idx) => {
          const IconComp = EVENT_ICONS[act.type] || EVENT_ICONS.default;
          return (
            <motion.div
              key={act.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="relative pl-6"
            >
              <div className="absolute -left-3 top-0.5 w-6 h-6 rounded-full bg-card border border-border/80 text-primary flex items-center justify-center shadow-2xs">
                <IconComp className="w-3 h-3" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{act.action}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{formatDate(act.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
