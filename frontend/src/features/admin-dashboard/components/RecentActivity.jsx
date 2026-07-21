/**
 * PulseCare AI - RecentActivity Component
 */

import React from 'react';
import { UserPlus, CheckCircle2, Calendar, XCircle, Pill, FileText, Sparkles, Bell, Upload, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_TYPES, ACTIVITY_CONFIG } from '../constants/dashboard.constants';

const ICON_MAP = {
  UserPlus,
  CheckCircle2,
  Calendar,
  XCircle,
  Pill,
  FileText,
  Sparkles,
  Bell,
  Upload,
};

export const RecentActivity = ({ activities = [], className = '' }) => {
  // Demo baseline items if empty
  const items = activities.length > 0 ? activities : [
    { id: 1, type: ACTIVITY_TYPES.PATIENT_REGISTERED, title: 'New Patient Registered', description: 'Patient Sarah Connor created an account', time: '5m ago' },
    { id: 2, type: ACTIVITY_TYPES.DOCTOR_APPROVED, title: 'Doctor Account Verified', description: 'Dr. Robert Chen (Cardiology) verified by Admin', time: '18m ago' },
    { id: 3, type: ACTIVITY_TYPES.APPOINTMENT_CREATED, title: 'Appointment Booked', description: 'Consultation scheduled with Dr. Smith', time: '42m ago' },
    { id: 4, type: ACTIVITY_TYPES.AI_SUMMARY_GENERATED, title: 'AI Summary Generated', description: 'Health assessment produced for Patient #104', time: '1h ago' },
    { id: 5, type: ACTIVITY_TYPES.PRESCRIPTION_ADDED, title: 'Prescription Issued', description: 'Amoxicillin prescribed by Dr. Johnson', time: '2h ago' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Real-time Platform Activity</h3>
            <p className="text-xs text-muted-foreground">Live event stream across all system modules</p>
          </div>
        </div>
      </div>

      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => {
            const config = ACTIVITY_CONFIG[item.type] || ACTIVITY_CONFIG[ACTIVITY_TYPES.PATIENT_REGISTERED];
            const IconComp = ICON_MAP[config.icon] || Activity;

            return (
              <motion.div
                key={item.id || idx}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group flex items-start space-x-3"
              >
                {/* Dot */}
                <div className={`absolute -left-[27px] top-1 p-1 rounded-full border shadow-2xs ${config.color}`}>
                  <IconComp className="w-3 h-3" />
                </div>

                <div className="flex-1 bg-accent/20 group-hover:bg-accent/40 border border-border/50 rounded-2xl p-3 transition-all space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.time || 'Recently'}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentActivity;
