import React from 'react';
import { Stethoscope, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import { formatNoteDate } from '../utils/doctorNote.utils';

export const DoctorNotePreview = ({ data, doctorName = 'Dr. Healthcare Specialist', patientName = 'Selected Patient' }) => {
  if (!data) return null;

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
            Note
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground font-display">{data.title || 'Clinical Consultation Record'}</h3>
            <p className="text-xs text-muted-foreground">Official Electronic Health Record (EHR)</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono space-y-0.5 sm:text-right">
          <p className="font-bold text-foreground">Date: {formatNoteDate(new Date())}</p>
          <p>Status: <span className="text-emerald-500 font-bold">Active / Verified</span></p>
        </div>
      </div>

      {/* Participants info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-primary" /> Attending Physician
          </span>
          <p className="text-sm font-bold text-foreground">{doctorName}</p>
        </div>

        <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-sky-500" /> Patient Name
          </span>
          <p className="text-sm font-bold text-foreground">{patientName}</p>
        </div>
      </div>

      {/* Structured Sections Preview */}
      <div className="space-y-4 text-xs">
        {data.chiefComplaint && (
          <div className="space-y-1">
            <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Chief Complaint & History</span>
            <p className="text-foreground bg-accent/20 p-3 rounded-xl border border-border/40">{data.chiefComplaint}</p>
          </div>
        )}

        {data.diagnosis && (
          <div className="space-y-1">
            <span className="font-bold text-emerald-500 uppercase text-[10px] tracking-wider">Diagnosis</span>
            <p className="text-foreground font-semibold bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">{data.diagnosis}</p>
          </div>
        )}

        {data.symptoms && (
          <div className="space-y-1">
            <span className="font-bold text-rose-500 uppercase text-[10px] tracking-wider">Reported Symptoms</span>
            <p className="text-foreground bg-accent/20 p-3 rounded-xl border border-border/40">{data.symptoms}</p>
          </div>
        )}

        {data.examination && (
          <div className="space-y-1">
            <span className="font-bold text-sky-500 uppercase text-[10px] tracking-wider">Physical Examination Findings</span>
            <p className="text-foreground bg-accent/20 p-3 rounded-xl border border-border/40">{data.examination}</p>
          </div>
        )}

        {data.advice && (
          <div className="space-y-1">
            <span className="font-bold text-teal-500 uppercase text-[10px] tracking-wider">Patient Advice & Plan</span>
            <p className="text-foreground bg-accent/20 p-3 rounded-xl border border-border/40 italic">"{data.advice}"</p>
          </div>
        )}

        {data.followUpDate && (
          <div className="space-y-1">
            <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wider">Follow-Up Date</span>
            <p className="text-foreground font-mono font-bold bg-accent/20 p-3 rounded-xl border border-border/40">{formatNoteDate(data.followUpDate)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-500 font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>Signed & Electronically Recorded</span>
        </div>
        <div className="text-right font-mono text-[11px] text-muted-foreground">
          <p className="font-bold text-foreground">{doctorName}</p>
          <p>PulseCare AI Network</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotePreview;
