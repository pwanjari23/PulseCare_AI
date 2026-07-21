/**
 * PulseCare AI - UpcomingAppointments Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const UpcomingAppointments = ({ appointments = [], className = '' }) => {
  // Demo items if empty
  const items = appointments.length > 0 ? appointments : [
    { id: 101, patientName: 'Sarah Connor', doctorName: 'Dr. Robert Chen', time: 'Today at 03:30 PM', type: 'Cardiology Follow-up', status: 'CONFIRMED' },
    { id: 102, patientName: 'John Doe', doctorName: 'Dr. Elena Rostova', time: 'Tomorrow at 10:00 AM', type: 'Routine EEG', status: 'PENDING' },
    { id: 103, patientName: 'Alice Smith', doctorName: 'Dr. Marcus Vance', time: 'Tomorrow at 02:15 PM', type: 'Pediatric Checkup', status: 'CONFIRMED' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Upcoming Platform Appointments</h3>
            <p className="text-xs text-muted-foreground">Next scheduled patient consultations</p>
          </div>
        </div>
        <Link
          to="/appointments"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-accent/20 hover:bg-accent/40 border border-border/50 transition-all text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2 font-bold text-foreground">
                <span>{item.patientName || `Patient #${item.patientId}`}</span>
                <span className="text-muted-foreground font-normal">with</span>
                <span className="text-primary">{item.doctorName || `Doctor #${item.doctorId}`}</span>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {item.time || item.appointmentAt}
                </span>
                <span>•</span>
                <span>{item.type || item.reason || 'General Consultation'}</span>
              </p>
            </div>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border self-start sm:self-center ${
                item.status === 'CONFIRMED'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {item.status || 'SCHEDULED'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
