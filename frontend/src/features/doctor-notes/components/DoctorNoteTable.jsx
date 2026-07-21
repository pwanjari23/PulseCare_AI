import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DoctorNoteStatusBadge from './DoctorNoteStatusBadge';
import { formatNoteDate, generateNoteCode, parseNoteContentSections } from '../utils/doctorNote.utils';

export const DoctorNoteTable = ({ notes = [], onEdit, onDelete, canManage = false }) => {
  if (notes.length === 0) return null;

  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/40 text-muted-foreground uppercase font-mono border-b border-border/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Note Code</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Title / Diagnosis</th>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Physician</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {notes.map((n) => {
              const code = generateNoteCode(n.id);
              const sections = parseNoteContentSections(n.noteContent);
              const docName = n.doctor ? `${n.doctor.user?.firstName || n.doctor.firstName || ''} ${n.doctor.user?.lastName || n.doctor.lastName || ''}`.trim() : 'Doctor';
              const patName = n.patient ? `${n.patient.firstName || ''} ${n.patient.lastName || ''}`.trim() : 'Patient';

              return (
                <tr key={n.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                    {code}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">
                    {formatNoteDate(n.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground max-w-xs truncate">
                    {n.title || sections.diagnosis || 'Clinical Note'}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                    {patName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {docName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <DoctorNoteStatusBadge isArchived={n.isArchived} size="small" />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        to={`/doctor-notes/${n.id}`}
                        className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEdit?.(n)}
                            className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Edit Note"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete?.(n)}
                            className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                            title="Archive Note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorNoteTable;
