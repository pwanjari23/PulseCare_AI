import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Pencil, ClipboardList, Calendar, User, Stethoscope, MessageSquare, Lock } from 'lucide-react';
import { useDoctorNote } from '../hooks/useDoctorNote';
import DoctorNoteStatusBadge from '../components/DoctorNoteStatusBadge';
import DoctorNoteSkeleton from '../components/DoctorNoteSkeleton';
import { formatNoteDate, generateNoteCode, parseNoteContentSections } from '../utils/doctorNote.utils';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const DoctorNoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isDoctor = role === ROLES.DOCTOR.toLowerCase();

  const { data: note, isLoading, error } = useDoctorNote(id);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <DoctorNoteSkeleton count={2} />;

  if (error || !note) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Doctor note record not found</p>
        <p className="text-xs text-muted-foreground">{error?.message || 'Invalid or missing note ID.'}</p>
        <Link to="/doctor-notes" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Doctor Notes
        </Link>
      </div>
    );
  }

  const code = generateNoteCode(note.id);
  const sections = parseNoteContentSections(note.noteContent);
  const docName = note.doctor ? `${note.doctor.user?.firstName || note.doctor.firstName || ''} ${note.doctor.user?.lastName || note.doctor.lastName || ''}`.trim() : 'Doctor';
  const patName = note.patient ? `${note.patient.firstName || ''} ${note.patient.lastName || ''}`.trim() : 'Patient';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Printable Header Controls */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-foreground font-display">{code}</h1>
              <DoctorNoteStatusBadge isArchived={note.isArchived} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Recorded on {formatNoteDate(note.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-foreground text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>Print Note</span>
          </button>

          {isDoctor && (
            <Link
              to={`/doctor-notes/${note.id}/edit`}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all flex items-center space-x-1.5"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground font-display">{note.title || 'Clinical Consultation Record'}</h2>
              <p className="text-xs text-muted-foreground">Official Clinical Encounter Document</p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-primary" /> Physician
            </span>
            <p className="text-sm font-bold text-foreground">{docName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/20 border border-border/40 space-y-1">
            <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-500" /> Patient
            </span>
            <p className="text-sm font-bold text-foreground">{patName}</p>
            <p className="text-muted-foreground text-[11px]">Record ID: #{note.patientId}</p>
          </div>
        </div>

        {/* Clinical Content Sections */}
        <div className="space-y-4 text-xs">
          {sections.chiefComplaint && (
            <div className="space-y-1">
              <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Chief Complaint & History</span>
              <p className="text-foreground bg-accent/20 p-4 rounded-2xl border border-border/40">{sections.chiefComplaint}</p>
            </div>
          )}

          {sections.diagnosis && (
            <div className="space-y-1">
              <span className="font-bold text-emerald-500 uppercase text-[10px] tracking-wider">Clinical Diagnosis</span>
              <p className="text-foreground font-semibold bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">{sections.diagnosis}</p>
            </div>
          )}

          {sections.symptoms && (
            <div className="space-y-1">
              <span className="font-bold text-rose-500 uppercase text-[10px] tracking-wider">Symptoms</span>
              <p className="text-foreground bg-accent/20 p-4 rounded-2xl border border-border/40">{sections.symptoms}</p>
            </div>
          )}

          {sections.examination && (
            <div className="space-y-1">
              <span className="font-bold text-sky-500 uppercase text-[10px] tracking-wider">Physical Examination</span>
              <p className="text-foreground bg-accent/20 p-4 rounded-2xl border border-border/40">{sections.examination}</p>
            </div>
          )}

          {sections.advice && (
            <div className="space-y-1">
              <span className="font-bold text-teal-500 uppercase text-[10px] tracking-wider">Patient Advice & Lifestyle Recommendations</span>
              <p className="text-foreground italic bg-accent/20 p-4 rounded-2xl border border-border/40">"{sections.advice}"</p>
            </div>
          )}

          {/* Plaintext body fallback */}
          {!sections.chiefComplaint && !sections.diagnosis && sections.body && (
            <div className="space-y-1">
              <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Consultation Content</span>
              <p className="text-foreground bg-accent/20 p-4 rounded-2xl border border-border/40 leading-relaxed font-mono whitespace-pre-wrap">{sections.body}</p>
            </div>
          )}
        </div>

        {/* Private Doctor Notes (Only visible to Doctors/Admins) */}
        {isDoctor && sections.internalNotes && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Internal Private Doctor Notes (Hidden from Patient)
            </span>
            <p className="text-foreground italic font-mono">{sections.internalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNoteDetailsPage;
