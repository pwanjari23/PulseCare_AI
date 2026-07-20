import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, ChevronRight } from 'lucide-react';

export const PrescriptionSummaryCard = ({ count = 12 }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-foreground font-display">Prescription Telemetry</h3>
        </div>
        <Link
          to="/doctor/prescriptions"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>Manage Rx</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground">Issued Today</span>
          <p className="text-xl font-extrabold text-foreground font-display">4 Rx</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground">Pending Renewals</span>
          <p className="text-xl font-extrabold text-amber-500 font-display">2 Pending</p>
        </div>
      </div>

      <Link
        to="/doctor/prescriptions"
        className="w-full py-2.5 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl text-center shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Write e-Prescription</span>
      </Link>
    </div>
  );
};

export default PrescriptionSummaryCard;
