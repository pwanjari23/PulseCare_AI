import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import DoctorNoteForm from '../components/DoctorNoteForm';
import { useCreateDoctorNote } from '../hooks/useCreateDoctorNote';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/api/axios';

export const CreateDoctorNotePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateDoctorNote();

  // Fetch patient list for selection
  const { data: patients = [] } = useQuery({
    queryKey: ['patients-list-doctor-note'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/patients');
        return res.data?.data || res.data || [];
      } catch {
        return [];
      }
    },
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData, {
      onSuccess: (res) => {
        const newId = res?.id || res?.data?.id;
        if (newId) {
          navigate(`/doctor-notes/${newId}`);
        } else {
          navigate('/doctor-notes');
        }
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center space-x-3">
        <Link
          to="/doctor-notes"
          className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Plus className="w-6 h-6 text-primary" />
            <span>Create Doctor Consultation Note</span>
          </h1>
          <p className="text-xs text-muted-foreground">Document clinical SOAP notes, diagnosis, and treatment advice.</p>
        </div>
      </div>

      <DoctorNoteForm
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
        patients={patients}
      />
    </div>
  );
};

export default CreateDoctorNotePage;
