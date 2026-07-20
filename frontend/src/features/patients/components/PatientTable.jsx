import React from 'react';
import PatientRow from './PatientRow';

export const PatientTable = ({ patients = [], canEdit = true }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/40 border-b border-border/60 text-[11px] font-mono font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3 px-4">Patient Name</th>
              <th className="py-3 px-4">Demographics</th>
              <th className="py-3 px-4">Blood Type</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <PatientRow key={patient.id} patient={patient} canEdit={canEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
