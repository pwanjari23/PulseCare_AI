import React from 'react';
import AppointmentRow from './AppointmentRow';

export const AppointmentTable = ({ appointments = [], isDoctor = false, onCancel, onComplete }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/40 border-b border-border/60 text-[11px] font-mono font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3 px-4">Appt ID</th>
              <th className="py-3 px-4">Doctor</th>
              {!isDoctor && <th className="py-3 px-4">Patient</th>}
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appointment={appt}
                isDoctor={isDoctor}
                onCancel={onCancel}
                onComplete={onComplete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
