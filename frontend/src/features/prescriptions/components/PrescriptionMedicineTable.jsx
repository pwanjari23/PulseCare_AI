import React from 'react';
import { Pill } from 'lucide-react';

export const PrescriptionMedicineTable = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-muted-foreground bg-accent/20 rounded-2xl">
        No medicines added to this prescription.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/40 text-muted-foreground uppercase font-mono border-b border-border/60">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Medication Name</th>
              <th className="px-4 py-3 font-semibold">Dosage</th>
              <th className="px-4 py-3 font-semibold">Frequency</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Instructions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {items.map((med, idx) => (
              <tr key={med.id || idx} className="hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3 font-mono text-muted-foreground">{idx + 1}</td>
                <td className="px-4 py-3 font-bold text-foreground flex items-center space-x-2">
                  <Pill className="w-4 h-4 text-primary shrink-0" />
                  <span>{med.medicationName || med.name}</span>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-foreground">{med.dosage}</td>
                <td className="px-4 py-3 text-muted-foreground">{med.frequency}</td>
                <td className="px-4 py-3 font-mono text-foreground font-semibold">
                  {med.durationDays ? `${med.durationDays} Days` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-muted-foreground italic">
                  {med.instructions || 'As directed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionMedicineTable;
