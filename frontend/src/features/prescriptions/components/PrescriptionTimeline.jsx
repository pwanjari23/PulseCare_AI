import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Pill, ChevronRight } from 'lucide-react';
import PrescriptionStatusBadge from './PrescriptionStatusBadge';
import { formatPrescriptionDate, generatePrescriptionCode } from '../utils/prescription.utils';

export const PrescriptionTimeline = ({ prescriptions = [] }) => {
  if (prescriptions.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60 font-sans">
      {prescriptions.map((p, idx) => {
        const code = generatePrescriptionCode(p.id);
        const docName = p.doctor ? `${p.doctor.user?.firstName || p.doctor.firstName || ''} ${p.doctor.user?.lastName || p.doctor.lastName || ''}`.trim() : 'Doctor';

        return (
          <div key={p.id || idx} className="relative group">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-4 shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-primary">{code}</span>
                  <span className="text-xs font-mono text-muted-foreground">• {formatPrescriptionDate(p.prescribedAt || p.createdAt)}</span>
                </div>
                <PrescriptionStatusBadge status={p.status || 'Active'} size="small" />
              </div>

              <div className="text-xs text-foreground space-y-1">
                <p className="font-semibold">Prescribed by {docName}</p>
                {p.diagnosis && <p className="text-muted-foreground text-[11px]">Diagnosis: {p.diagnosis}</p>}
              </div>

              {/* Items List */}
              <div className="pt-2 border-t border-border/40 space-y-1">
                {(p.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-accent/20 rounded-xl">
                    <span className="font-bold text-foreground flex items-center space-x-1.5">
                      <Pill className="w-3.5 h-3.5 text-primary" />
                      <span>{item.medicationName || item.name}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{item.dosage} • {item.frequency}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  to={`/prescriptions/${p.id}`}
                  className="text-[11px] font-bold text-primary hover:underline inline-flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrescriptionTimeline;
