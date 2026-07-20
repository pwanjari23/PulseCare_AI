import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle2, X } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { formatAppointmentDate } from '../utils/appointment.utils';

export const AppointmentRow = ({ appointment, isDoctor = false, onCancel, onComplete }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-accent/40 border-b border-border/40 transition-colors text-xs">
      <td className="py-3 px-4">
        <div>
          <p className="font-bold text-foreground font-mono">#{appointment.id}</p>
          <p className="text-[11px] text-muted-foreground">{appointment.type || 'In-Person'}</p>
        </div>
      </td>

      <td className="py-3 px-4">
        <div>
          <p className="font-bold text-foreground">{appointment.doctorName || 'Dr. Sarah Jenkins'}</p>
          <p className="text-[11px] text-muted-foreground">{appointment.specialization || 'Cardiology'}</p>
        </div>
      </td>

      {!isDoctor && (
        <td className="py-3 px-4 font-semibold text-foreground">
          {appointment.patientName || 'John Doe'}
        </td>
      )}

      <td className="py-3 px-4 text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground">{formatAppointmentDate(appointment.date)}</p>
          <p className="text-[11px]">{appointment.slotTime || '10:30 AM'}</p>
        </div>
      </td>

      <td className="py-3 px-4 max-w-[160px]">
        <p className="text-muted-foreground truncate">{appointment.reason || 'Health consultation'}</p>
      </td>

      <td className="py-3 px-4">
        <AppointmentStatusBadge status={appointment.status || 'Confirmed'} />
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => navigate(`/appointments/${appointment.id}`)}
            className="px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {isDoctor && appointment.status === 'Confirmed' && (
            <button
              onClick={() => onComplete && onComplete(appointment)}
              className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-xs transition-colors"
              title="Mark Completed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}

          {['Pending', 'Confirmed'].includes(appointment.status) && (
            <button
              onClick={() => onCancel && onCancel(appointment)}
              className="p-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AppointmentRow;
