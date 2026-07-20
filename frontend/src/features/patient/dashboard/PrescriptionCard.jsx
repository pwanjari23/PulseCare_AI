import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Pill } from 'lucide-react';

export const PrescriptionCard = ({ prescriptions = [] }) => {
  const dummyPrescriptions = [
    { id: 1, medicine: 'Amoxicillin', dosage: '500 mg', frequency: 'Twice Daily', remainingDays: 5, status: 'Active' },
    { id: 2, medicine: 'Lisinopril', dosage: '10 mg', frequency: 'Once Daily', remainingDays: 18, status: 'Active' },
  ];

  const displayList = prescriptions.length > 0 ? prescriptions : dummyPrescriptions;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-foreground font-display">Active Prescriptions</h3>
        </div>
        <Link
          to="/patient/prescriptions"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All ({displayList.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {displayList.map((rx) => (
          <div
            key={rx.id}
            className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{rx.medicine}</h4>
                <p className="text-muted-foreground text-[11px]">{rx.dosage} • {rx.frequency}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {rx.remainingDays} days left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCard;
