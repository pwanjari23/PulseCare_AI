import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import DoctorNoteForm from '../components/DoctorNoteForm';
import DoctorNoteSkeleton from '../components/DoctorNoteSkeleton';
import { useDoctorNote } from '../hooks/useDoctorNote';
import { useUpdateDoctorNote } from '../hooks/useUpdateDoctorNote';
import { parseNoteContentSections } from '../utils/doctorNote.utils';

export const EditDoctorNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading, error } = useDoctorNote(id);
  const updateMutation = useUpdateDoctorNote();

  const onSubmit = (formData) => {
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate(`/doctor-notes/${id}`);
        },
      }
    );
  };

  if (isLoading) return <DoctorNoteSkeleton count={2} />;

  if (error || !note) {
    return (
      <div className="text-center py-12 bg-card border border-border/60 rounded-3xl max-w-md mx-auto space-y-3 font-sans">
        <p className="text-sm font-bold text-foreground">Doctor note not found</p>
        <Link to="/doctor-notes" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl inline-block">
          Back to Doctor Notes
        </Link>
      </div>
    );
  }

  const sections = parseNoteContentSections(note.noteContent);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to={`/doctor-notes/${id}`}
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Pencil className="w-6 h-6 text-primary" />
            <span>Edit Consultation Note #{id}</span>
          </h1>
          <p className="text-xs text-muted-foreground">Update clinical findings, diagnosis, or advice.</p>
        </div>
      </div>

      <DoctorNoteForm
        defaultValues={{
          patientId: note.patientId,
          title: note.title || 'Clinical Consultation Note',
          chiefComplaint: sections.chiefComplaint || sections.body || note.noteContent || '',
          diagnosis: sections.diagnosis || '',
          symptoms: sections.symptoms || '',
          examination: sections.examination || '',
          advice: sections.advice || '',
          followUpDate: sections.followUpDate || '',
          internalNotes: sections.internalNotes || '',
          isPatientVisible: sections.isPatientVisible !== false,
        }}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
        isEdit={true}
      />
    </div>
  );
};

export default EditDoctorNotePage;
