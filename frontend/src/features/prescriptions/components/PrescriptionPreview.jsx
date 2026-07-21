import React from 'react';
import { Stethoscope, User, Calendar, Pill, FileText, CheckCircle } from 'lucide-react';
import PrescriptionMedicineTable from './PrescriptionMedicineTable';
import { formatPrescriptionDate } from '../utils/prescription.utils';

export const PrescriptionPreview = ({ data, doctorName = 'Dr. Healthcare Specialist', patientName = 'Selected Patient' }) => {
  if (!data) return null;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
            Rx
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground font-display">Medical Prescription Preview</h3>
            <p className="text-xs text-muted-foreground">Official Clinical Order Summary</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono space-y-0.5 sm:text-right">
          <p className="font-bold text-foreground">Date: {formatPrescriptionDate(new Date())}</p>
          <p>Status: <span className="text-emerald-500 font-bold">Draft / Active</span></p>
        </div>
      </div>

      {/* Participants info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-primary" /> Prescribing Physician
          </span>
          <p className="text-sm font-bold text-foreground">{doctorName}</p>
          <p className="text-muted-foreground text-[11px]">PulseCare AI Telehealth Services</p>
        </div>

        <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-sky-500" /> Patient Info
          </span>
          <p className="text-sm font-bold text-foreground">{patientName}</p>
          {data.patientId && <p className="text-muted-foreground text-[11px]">Patient Record #{data.patientId}</p>}
        </div>
      </div>

      {/* Diagnosis if any */}
      {data.diagnosis && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl text-xs space-y-0.5">
          <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Clinical Diagnosis</span>
          <p className="text-foreground font-semibold">{data.diagnosis}</p>
        </div>
      )}

      {/* Medicines Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-foreground font-display flex items-center space-x-1">
          <Pill className="w-4 h-4 text-primary" />
          <span>Prescribed Medications ({data.items?.length || 0})</span>
        </h4>
        <PrescriptionMedicineTable items={data.items || []} />
      </div>

      {/* Clinical Notes & Follow up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/40">
        {data.clinicalNotes && (
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Clinical Notes & Advice</span>
            <p className="text-muted-foreground italic bg-accent/20 p-3 rounded-xl border border-border/40">
              "{data.clinicalNotes}"
            </p>
          </div>
        )}

        {data.followUpDate && (
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">Recommended Follow-Up</span>
            <p className="text-foreground font-bold font-mono bg-accent/20 p-3 rounded-xl border border-border/40">
              {formatPrescriptionDate(data.followUpDate)}
            </p>
          </div>
        )}
      </div>

      {/* Digital Signature Placeholder */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-500 font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>Digitally Signed & Verified</span>
        </div>
        <div className="text-right font-mono text-[11px] text-muted-foreground">
          <p className="border-b border-border/60 pb-1 font-bold text-foreground">{doctorName}</p>
          <p>Licensed Medical Officer</p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;
