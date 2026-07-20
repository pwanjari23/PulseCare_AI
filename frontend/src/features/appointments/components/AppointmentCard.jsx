import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Stethoscope, Eye, X } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { formatAppointmentDate } from '../utils/appointment.utils';

export const AppointmentCard = ({ appointment, onCancel, canCancel = true }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/60 hover:border-border/90 rounded-3xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-display shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{appointment.doctorName || 'Dr. Sarah Jenkins'}</h4>
              <p className="text-xs text-muted-foreground">{appointment.specialization || 'Cardiology'}</p>
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status || 'Confirmed'} />
        </div>

        <div className="pt-1 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-primary" />
              <span>Date</span>
            </span>
            <p className="font-bold text-foreground">{formatAppointmentDate(appointment.date)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Clock className="w-3 h-3 text-healing-500" />
              <span>Time Slot</span>
            </span>
            <p className="font-bold text-foreground">{appointment.slotTime || '10:30 AM'}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border/40 pt-2 line-clamp-2">
          <span className="font-semibold text-foreground">Reason: </span>
          {appointment.reason || 'Routine health consultation'}
        </p>
      </div>

      <div className="flex items-center space-x-2 pt-1 border-t border-border/40">
        <button
          onClick={() => navigate(`/appointments/${appointment.id}`)}
          className="flex-1 py-2 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        {canCancel && ['Pending', 'Confirmed'].includes(appointment.status) && (
          <button
            onClick={() => onCancel && onCancel(appointment)}
            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl transition-colors"
            title="Cancel Appointment"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
