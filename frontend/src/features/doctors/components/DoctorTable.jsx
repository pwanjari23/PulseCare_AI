import React from 'react';
import DoctorRow from './DoctorRow';

export const DoctorTable = ({ doctors = [], isAdmin = false, onApprove, onReject, onSuspend }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/40 border-b border-border/60 text-[11px] font-mono font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3 px-4">Doctor Name</th>
              <th className="py-3 px-4">Specialization</th>
              <th className="py-3 px-4">Hospital & Exp</th>
              <th className="py-3 px-4">Consultation Fee</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                isAdmin={isAdmin}
                onApprove={onApprove}
                onReject={onReject}
                onSuspend={onSuspend}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorTable;
