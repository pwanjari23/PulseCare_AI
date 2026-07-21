import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, Eye, Pencil, Trash2, User, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import DoctorNoteStatusBadge from './DoctorNoteStatusBadge';
import { formatNoteDate, generateNoteCode, parseNoteContentSections } from '../utils/doctorNote.utils';

export const DoctorNoteCard = ({ note, onEdit, onDelete, canManage = false }) => {
  if (!note) return null;

  const code = generateNoteCode(note.id);
  const sections = parseNoteContentSections(note.noteContent);
  const docName = note.doctor ? `${note.doctor.user?.firstName || note.doctor.firstName || ''} ${note.doctor.user?.lastName || note.doctor.lastName || ''}`.trim() : 'Doctor';
  const patName = note.patient ? `${note.patient.firstName || ''} ${note.patient.lastName || ''}`.trim() : 'Patient';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm hover:border-border transition-all space-y-4 font-sans"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
              {code}
            </span>
            <DoctorNoteStatusBadge isArchived={note.isArchived} size="small" />
          </div>
          <h4 className="text-sm font-bold text-foreground mt-1 truncate">
            {note.title || sections.diagnosis || 'Clinical Consultation Note'}
          </h4>
          <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation Date: {formatNoteDate(note.createdAt)}</span>
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            to={`/doctor-notes/${note.id}`}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canManage && (
            <>
              <button
                onClick={() => onEdit?.(note)}
                className="p-1.5 rounded-xl hover:bg-primary/10 text-primary border border-primary/20 transition-colors"
                title="Edit Note"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(note)}
                className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-colors"
                title="Archive Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-border/40">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-muted-foreground block">Physician</span>
            <span className="font-bold text-foreground truncate">{docName || 'Dr. Assigned'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-sky-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-muted-foreground block">Patient</span>
            <span className="font-bold text-foreground truncate">{patName || 'Patient'}</span>
          </div>
        </div>
      </div>

      {/* Content Snippet */}
      <div className="bg-accent/20 p-3 rounded-2xl border border-border/40 text-xs text-muted-foreground line-clamp-3">
        {sections.chiefComplaint || sections.body || note.noteContent}
      </div>
    </motion.div>
  );
};

export default DoctorNoteCard;
