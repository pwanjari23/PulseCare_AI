import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, ClipboardList } from 'lucide-react';
import DoctorNoteStatusBadge from './DoctorNoteStatusBadge';
import { formatNoteDate, generateNoteCode, parseNoteContentSections } from '../utils/doctorNote.utils';

export const DoctorNoteTimeline = ({ notes = [] }) => {
  if (notes.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60 font-sans">
      {notes.map((n, idx) => {
        const code = generateNoteCode(n.id);
        const sections = parseNoteContentSections(n.noteContent);
        const docName = n.doctor ? `${n.doctor.user?.firstName || n.doctor.firstName || ''} ${n.doctor.user?.lastName || n.doctor.lastName || ''}`.trim() : 'Doctor';

        return (
          <div key={n.id || idx} className="relative group">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-4 shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-primary">{code}</span>
                  <span className="text-xs font-mono text-muted-foreground">• {formatNoteDate(n.createdAt)}</span>
                </div>
                <DoctorNoteStatusBadge isArchived={n.isArchived} size="small" />
              </div>

              <div className="text-xs text-foreground space-y-1">
                <p className="font-bold text-sm">{n.title || sections.diagnosis || 'Clinical Note'}</p>
                <p className="text-muted-foreground">Recorded by {docName}</p>
              </div>

              <div className="bg-accent/20 p-3 rounded-xl border border-border/40 text-xs text-muted-foreground italic">
                "{sections.chiefComplaint || sections.body || n.noteContent}"
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  to={`/doctor-notes/${n.id}`}
                  className="text-[11px] font-bold text-primary hover:underline inline-flex items-center space-x-1"
                >
                  <span>View Full Note</span>
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

export default DoctorNoteTimeline;
