import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';

export const AppointmentTable = ({ appointments, role = 'patient', onCancel, onComplete }) => {
  const isDoctor = role === 'doctor';

  return (
    <div className="w-full overflow-hidden border border-border/60 rounded-2xl bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/50 border-b border-border/50 text-muted-foreground font-mono font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">{isDoctor ? 'Patient' : 'Doctor'}</th>
              <th className="py-3.5 px-4">Scheduled Date</th>
              <th className="py-3.5 px-4">Time</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {appointments.map((app) => {
              const doctorName = app.Doctor
                ? `Dr. ${app.Doctor.firstName || ''} ${app.Doctor.lastName || ''}`
                : app.doctorName || 'Dr. Specialist';

              const patientName = app.Patient
                ? `${app.Patient.firstName || ''} ${app.Patient.lastName || ''}`
                : app.patientName || 'Patient User';

              const scheduledDate = app.scheduledAt
                ? new Date(app.scheduledAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : app.date || 'TBD';

              const scheduledTime = app.scheduledAt
                ? new Date(app.scheduledAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : app.time || '10:00 AM';

              const isCompleted = app.status?.toLowerCase() === 'completed';
              const isCancelled = app.status?.toLowerCase() === 'cancelled';

              return (
                <tr key={app.id} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {isDoctor ? patientName : doctorName}
                  </td>
                  <td className="py-3.5 px-4 text-foreground">{scheduledDate}</td>
                  <td className="py-3.5 px-4 text-foreground">{scheduledTime}</td>
                  <td className="py-3.5 px-4">
                    <AppointmentStatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                    {app.reason || 'General Consultation'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {isDoctor && !isCompleted && !isCancelled && onComplete && (
                        <button
                          onClick={() => onComplete(app)}
                          className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold rounded-md border border-emerald-500/20 transition-colors flex items-center space-x-1"
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      {!isCompleted && !isCancelled && onCancel && (
                        <button
                          onClick={() => onCancel(app)}
                          className="px-2 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-md border border-rose-500/20 transition-colors flex items-center space-x-1"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      <Link
                        to={`/appointments/${app.id}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
